pipeline {
  agent any
  stages {
    stage('Check for vulnerabilities') {
      steps {
        sh 'npm audit --parseable --production'
        // sh 'npm outdated || exit 0'
      }
    }

    stage('download dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Check linting') {
      steps {
        sh 'npm run lint'
      }
    }

    // stage('Check unit:test') {
    //   steps {
    //     sh 'npm run test:unit -- --ci --coverage'
    //   }
    //   post {
    //     always {
    //       junit 'junit.xml'
    //       example exampleReportFile: 'coverage/example-coverage.xml'
    //     }
    //   }
    // }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    // stage('Check unit:e2e') {
    //   steps {
    //     sh 'npm run test:e2e -- --headless --url https://www.example.com --config video=false || exit 0'
    //   }
    // }
  }
  
}



// REF:
//  https://github.com/Andre-ADPC/Vite-TS-Vue-React-Prj-Template-2025/blob/master/DOCS/Build%20a%20Jenkins%20Pipeline.md