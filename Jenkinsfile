pipeline {
    agent any

    environment {
        NETLIFY_SITE_ID = 'ae5d158e-4405-480d-80a3-3cd809ef622a'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
    }

    stages {

            // stage('Ansible Configuration') {
            //     steps {
            //         script {
            //             sh '''
            //                 ansible-playbook -i inventory ansible_setup.yml
            //             '''
            //         }
            //     }
            // }

           stage('Build') {

            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                   ls -la
                   node --version
                   npm --version
                   npm ci
                   npm run build
                   ls -la     

                '''
            }
        }

          stage('Test') {

            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }

            steps {
                sh '''
                    node --version
                    npm --version
                    test -f dist/index.html
                    npm test
                '''
            }
        }

          stage('Deploy') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            
            steps {
                sh '''
                    npm install netlify-cli 
                    node_modules/.bin/netlify --version  
                    echo "Deploying to Production. Site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status 
                    node_modules/.bin/netlify deploy --dir=dist --prod
                '''
            }
        }

    }

     post {
            always {
                junit 'test-results/junit.xml'
            }
     }
}
