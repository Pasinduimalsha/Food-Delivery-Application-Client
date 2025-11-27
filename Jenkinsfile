pipeline {
  agent any
   parameters {
        booleanParam(name: 'autoApprove', defaultValue: false, description: 'Automatically run apply after generating plan?')
    }
  environment {
	AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
	LOCAL_BIN_PATH = "/usr/local/bin:/opt/homebrew/bin"
	IMAGE_NAME = "pasindu12345/food-delivery-application-client:v0.0.1$BUILD_NUMBER"
	}
  stages {
	 stage('Install Dependencies') {
      steps {
		withEnv(["PATH+LOCAL=/usr/local/bin:/opt/homebrew/bin"]){
		sh 'npm ci'
		}
      }
    }

    stage('Check for vulnerabilities') {
      steps {
		withEnv(["PATH+LOCAL=/usr/local/bin:/opt/homebrew/bin"]){
        sh 'npm audit --parseable --production'
        // sh 'npm outdated || exit 0'
		}
      }
    }

    stage('Check linting') {
      steps {
		withEnv(["PATH+LOCAL=/usr/local/bin:/opt/homebrew/bin"]){
        sh 'npm run lint'
		}
      }
    }

    // stage('Check unit:test') {
    //   steps {
    //     sh 'npm run test:unit -- --ci --coverage'
    //   }
    //   post {
    //     always {
    //       junit 'junit.xml'
    //       cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml'
    //     }
    //   }
    // }

    stage('Build') {
      steps {
		withEnv(["PATH+LOCAL=/usr/local/bin:/opt/homebrew/bin"]){
    	sh 'npm run build'
		}
      }
    }

	stage('checkout') {
		steps {
				script{
					dir("terraform")
					{
						git "https://github.com/Pasinduimalsha/Food-Delivery-Application-Client.git"
					}
				}
			}
    }

	stage('Plan') {
		steps {
			withEnv(["PATH+LOCAL=/usr/local/bin:/opt/homebrew/bin"]){
				sh 'pwd;cd terraform/ ; terraform init'
				sh "pwd;cd terraform/ ; terraform plan -out=tfplan"
				sh 'pwd;cd terraform/ ; terraform show -no-color tfplan > tfplan.txt'

				// stash name: 'tfplan-artifact', , includes: '**'
			}
		}
	}
	stage('Approval') {
		when {
			not {
				equals expected: true, actual: params.autoApprove
			}
		}
		steps {
			script {
				withEnv(["PATH+LOCAL=/usr/local/bin:/opt/homebrew/bin"]){
				// unstash 'tfplan-artifact'
				def plan = readFile 'terraform/tfplan.txt'
				input message: "Do you want to apply the plan?",
				parameters: [text(name: 'Plan', description: 'Please review the plan', defaultValue: plan)]
				}
			}
		}
	}
	stage('Apply') {
		steps {
			withEnv(["PATH+LOCAL=/usr/local/bin:/opt/homebrew/bin"]){
				// unstash 'tfplan-artifact'
				sh "pwd;cd terraform/ ; terraform apply -input=false tfplan"
				sh "pwd;cd terraform/ ; terraform output -raw food_ordering_client_deploy_server_ip"
			}
		}
	}
	stage('Get Server IPs') {
		steps {
			script {
				withEnv(["PATH+LOCAL=${LOCAL_BIN_PATH}"]) {
					def clientServerIp = sh(
						script: 'cd terraform/ ; terraform output -raw food_ordering_client_deploy_server_ip',
						returnStdout: true
					).trim()
					echo "Client Server IP: ${clientServerIp}"
					def clientServerConn = "ubuntu@${clientServerIp}"
					echo "Build Server SSH Connection String: ${clientServerConn}"

					writeFile file: 'client_server_conn.txt', text: clientServerConn
					stash name: 'client_conn_data', includes: 'client_server_conn.txt'
				}
			}
		}
	}

	stage("Build the docker image and push to dockerhub"){
	agent any
	steps {
		script {
			unstash 'client_conn_data'
            def DEPLOY_SERVER = readFile('client_server_conn.txt').trim()

			sshagent(['Jenkins-slave']){
				withCredentials([usernamePassword(credentialsId: '12345678', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]){
					echo "Connecting to Build Server: ${DEPLOY_SERVER}"
					echo "Packing the code and create a docker image"
					sh "scp -o StrictHostKeyChecking=no \
						Dockerfile \
						docker-compose.yml \
						dist/* \
						package.json \
						package-lock.json \
						vite.config.js \
						${DEPLOY_SERVER}:/home/ubuntu/"

					sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'bash ~/docker-script.sh'"
					sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'chmod +x npm-script.sh'"
					sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'bash ~/npm-script.sh'"

					// echo "Compiling code and creating JAR file on the DEPLOY_SERVER"
					// sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'mvn clean package -DskipTests'"

					sh "ssh ${DEPLOY_SERVER} sudo docker build -t ${IMAGE_NAME} /home/ubuntu/"
					sh "ssh ${DEPLOY_SERVER} sudo docker login -u $USERNAME -p $PASSWORD"
					sh "ssh ${DEPLOY_SERVER} sudo docker push ${IMAGE_NAME}"
				}
			}
		}
	}
}
// stage("Run the docker image using docker-compose"){
// 	agent any
// 	steps{
// 		script{
// 				unstash 'deploy_conn_data'
// 				def DEPLOY_SERVER = readFile('deploy_server_conn.txt').trim()

// 			sshagent(['Jenkins-slave']){
// 				withCredentials([usernamePassword(credentialsId: '12345678', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]){
// 						echo "Pull the docker image"
// 						sh "scp -o StrictHostKeyChecking=no -r ${WORKSPACE}/* ${DEPLOY_SERVER}:/home/ubuntu/"
// 						sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'bash ~/docker-script.sh'"
// 						sh "ssh ${DEPLOY_SERVER} sudo docker login -u $USERNAME -p $PASSWORD"
// 						sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_SERVER} 'bash ~/docker-compose-script.sh ${IMAGE_NAME}'"
// 				}
// 			}
// 		}
// 	}

// }

    // stage('Check unit:e2e') {
    //   steps {
    //     sh 'npm run test:e2e -- --headless --url https://www.example.com --config video=false || exit 0'
    //   }
    // }
  }

}



// REF:
//  https://github.com/Andre-ADPC/Vite-TS-Vue-React-Prj-Template-2025/blob/master/DOCS/Build%20a%20Jenkins%20Pipeline.md