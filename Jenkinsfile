pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Pull Latest Code') {
            steps {
                git url: 'https://github.com/admiregroup2025/Admire-Holidays-backend.git', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Restart Backend with PM2') {
            steps {
                sh 'pm2 restart admire-backend || pm2 start src/index.js --name admire-backend'
            }
        }
    }
}
