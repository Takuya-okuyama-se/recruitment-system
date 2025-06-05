const crypto = require('crypto');
const { Pool } = require('pg');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.pool = new Pool({
      // SSL接続を強制
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT
      }
    });
  }

  // マスターキーから派生キーを生成
  deriveKey(masterKey, salt) {
    return crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256');
  }

  // データ暗号化
  encrypt(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: Buffer.concat([iv, authTag, encrypted]),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  // データ復号化
  decrypt(encryptedData, key) {
    const data = Buffer.from(encryptedData);
    const iv = data.slice(0, 16);
    const authTag = data.slice(16, 32);
    const encrypted = data.slice(32);
    
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return JSON.parse(decrypted.toString('utf8'));
  }

  // 個人情報の暗号化
  async encryptPersonalData(candidateData) {
    const { firstName, lastName, email, phone } = candidateData;
    
    // 暗号化キーを取得
    const keyResult = await this.pool.query(
      'SELECT encrypted_key FROM encryption_keys WHERE is_active = true ORDER BY key_version DESC LIMIT 1'
    );
    
    if (keyResult.rows.length === 0) {
      throw new Error('No active encryption key found');
    }
    
    // マスターキーで復号化（実際はHSMやKMSを使用）
    const encryptionKey = this.decryptMasterKey(keyResult.rows[0].encrypted_key);
    
    // 個人情報を暗号化
    const personalData = { firstName, lastName, email, phone };
    const encryptedData = this.encrypt(personalData, encryptionKey);
    
    // メールのハッシュ値を生成（検索用）
    const emailHash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
    
    return {
      encryptedData: encryptedData.encrypted,
      emailHash
    };
  }

  // セキュアなセッショントークン生成
  generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // パスワードハッシュ化（Argon2推奨だが、ここではbcryptの例）
  async hashPassword(password) {
    const salt = crypto.randomBytes(16);
    return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex') + ':' + salt.toString('hex');
  }

  // パスワード検証
  async verifyPassword(password, hash) {
    const [hashedPassword, salt] = hash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 64, 'sha256').toString('hex');
    return hashedPassword === verifyHash;
  }

  // データアクセスログ記録
  async logDataAccess(userId, table, recordId, accessType, fields) {
    try {
      await this.pool.query(
        `INSERT INTO data_access_logs 
         (user_id, accessed_table, accessed_id, access_type, accessed_fields, ip_address)
         VALUES ($1, $2, $3, $4, $5, current_setting('app.client_ip')::INET)`,
        [userId, table, recordId, accessType, fields]
      );
    } catch (error) {
      console.error('Failed to log data access:', error);
    }
  }

  // IPアドレスベースのレート制限チェック
  async checkRateLimit(ipAddress, action) {
    const result = await this.pool.query(
      `SELECT COUNT(*) as attempt_count 
       FROM audit_logs 
       WHERE ip_address = $1 
       AND operation = $2 
       AND timestamp > NOW() - INTERVAL '15 minutes'`,
      [ipAddress, action]
    );
    
    const attemptCount = parseInt(result.rows[0].attempt_count);
    const limit = action === 'LOGIN' ? 5 : 100;
    
    return attemptCount < limit;
  }

  // マスターキーの復号化（実際の実装ではHSM/KMSを使用）
  decryptMasterKey(encryptedKey) {
    // 実際の実装では、Hardware Security Module (HSM) や
    // AWS KMS、Azure Key Vault などを使用
    // ここでは簡略化した例
    const masterSecret = process.env.MASTER_KEY_SECRET;
    if (!masterSecret) {
      throw new Error('Master key secret not configured');
    }
    
    // 実際の復号化処理
    return Buffer.from(masterSecret, 'hex');
  }
}

module.exports = EncryptionService;