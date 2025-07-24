const axios = require('axios');

class HealthChecker {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/health`, {
        timeout: 5000
      });

      const health = response.data;
      
      console.log('Health Check Results:');
      console.log('====================');
      console.log(`Status: ${health.status}`);
      console.log(`Timestamp: ${health.timestamp}`);
      console.log(`Uptime: ${Math.round(health.uptime)}s`);
      console.log(`Environment: ${health.environment}`);
      console.log(`Database: ${health.database}`);
      console.log(`Node Version: ${health.version}`);
      
      if (health.memory) {
        console.log('Memory Usage:');
        console.log(`  RSS: ${Math.round(health.memory.rss / 1024 / 1024)}MB`);
        console.log(`  Heap Used: ${Math.round(health.memory.heapUsed / 1024 / 1024)}MB`);
        console.log(`  Heap Total: ${Math.round(health.memory.heapTotal / 1024 / 1024)}MB`);
      }

      return health.status === 'OK';
    } catch (error) {
      console.error('Health check failed:', error.message);
      return false;
    }
  }

  async checkDatabase() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/health`);
      return response.data.database === 'connected';
    } catch (error) {
      console.error('Database check failed:', error.message);
      return false;
    }
  }

  async checkResponseTime() {
    const start = Date.now();
    try {
      await axios.get(`${this.baseUrl}/api/health`);
      const responseTime = Date.now() - start;
      console.log(`Response time: ${responseTime}ms`);
      return responseTime < 1000; // Should respond within 1 second
    } catch (error) {
      console.error('Response time check failed:', error.message);
      return false;
    }
  }

  async runFullCheck() {
    console.log('Starting comprehensive health check...\n');
    
    const healthOk = await this.checkHealth();
    const dbOk = await this.checkDatabase();
    const responseOk = await this.checkResponseTime();

    console.log('\nSummary:');
    console.log('========');
    console.log(`Health Check: ${healthOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Database: ${dbOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Response Time: ${responseOk ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = healthOk && dbOk && responseOk;
    console.log(`\nOverall Status: ${allPassed ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
    
    return allPassed;
  }
}

// Usage example
if (require.main === module) {
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  const checker = new HealthChecker(baseUrl);
  
  checker.runFullCheck()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Health check error:', error);
      process.exit(1);
    });
}

module.exports = HealthChecker; 