#!/bin/bash

LOGFILE="combined_output.log"
ERRORFILE="combined_error.log"

echo "Select an option:"
echo "1. Install SmartFasS setup"
echo "2. Install OpenWhisk setup"
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" -eq 1 ] || [ "$choice" -eq 2 ]; then
    {
        if [ "$choice" -eq 1 ] || [ "$choice" -eq 2 ]; then
            echo "Starting the SmartFasS environment setup process..." | tee -a $LOGFILE

            echo "Updating package lists..." | tee -a $LOGFILE
            sudo apt-get update

            echo "Installing required packages..." | tee -a $LOGFILE
            sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

            echo "Adding Docker GPG key..." | tee -a $LOGFILE
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

            echo "Adding Docker repository..." | tee -a $LOGFILE
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

            echo "Updating package lists again..." | tee -a $LOGFILE
            sudo apt-get update

            echo "Installing Docker..." | tee -a $LOGFILE
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io

            echo "Checking Docker version..." | tee -a $LOGFILE
            sudo docker --version

            echo "Downloading Docker Compose..." | tee -a $LOGFILE
            sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

            echo "Making Docker Compose executable..." | tee -a $LOGFILE
            sudo chmod +x /usr/local/bin/docker-compose

            echo "Checking Docker Compose version..." | tee -a $LOGFILE
            docker-compose --version

            echo "Installing OpenJDK 11..." | tee -a $LOGFILE
            sudo apt-get install -y openjdk-11-jdk

            echo "Checking Java version..." | tee -a $LOGFILE
            java -version

            echo "Setting up Node.js repository..." | tee -a $LOGFILE
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

            echo "Installing Node.js..." | tee -a $LOGFILE
            sudo apt-get install -y nodejs

            echo "Downloading JMeter..." | tee -a $LOGFILE
            sudo wget https://downloads.apache.org/jmeter/binaries/apache-jmeter-5.6.3.zip

            echo "Installing unzip..." | tee -a $LOGFILE
            sudo apt-get install -y unzip

            echo "Unzipping JMeter..." | tee -a $LOGFILE
            sudo unzip apache-jmeter-5.6.3.zip

            echo "Moving JMeter to /usr/local/bin..." | tee -a $LOGFILE
            sudo mv apache-jmeter-5.6.3 /usr/local/bin/jmeter

            echo "Setting JMeter environment variables..." | tee -a $LOGFILE
            echo 'export JMETER_HOME=/usr/local/bin/jmeter' >> ~/.bashrc
            echo 'export PATH=$JMETER_HOME/bin:$PATH' >> ~/.bashrc
            source ~/.bashrc

            echo "Checking JMeter version..." | tee -a $LOGFILE
            jmeter --version

            echo "Adding Redis GPG key..." | tee -a $LOGFILE
            curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

            echo "Setting permissions for Redis GPG key..." | tee -a $LOGFILE
            sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg

            echo "Adding Redis repository..." | tee -a $LOGFILE
            echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

            echo "Updating package lists again..." | tee -a $LOGFILE
            sudo apt-get update

            echo "Installing Redis..." | tee -a $LOGFILE
            sudo apt-get install redis

            echo "SmartFasS environment setup process completed successfully." | tee -a $LOGFILE
        fi

        if [ "$choice" -eq 2 ]; then
            echo "Starting the OpenWhisk setup process..." | tee -a $LOGFILE

            echo "Downloading kubectl..." | tee -a $LOGFILE
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" | tee -a $LOGFILE

            echo "Installing kubectl..." | tee -a $LOGFILE
            sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl | tee -a $LOGFILE

            echo "Checking kubectl version..." | tee -a $LOGFILE
            kubectl version --client | tee -a $LOGFILE

            echo "Downloading kind..." | tee -a $LOGFILE
            [ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.25.0/kind-$(uname)-amd64 | tee -a $LOGFILE

            echo "Making kind executable..." | tee -a $LOGFILE
            chmod +x ./kind | tee -a $LOGFILE

            echo "Moving kind to /usr/local/bin..." | tee -a $LOGFILE
            sudo mv ./kind /usr/local/bin/kind | tee -a $LOGFILE

            echo "Cloning openwhisk-deploy-kube repository..." | tee -a $LOGFILE
            git clone https://github.com/apache/openwhisk-deploy-kube.git | tee -a $LOGFILE

            echo "Setting up Helm..." | tee -a $LOGFILE
            curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null | tee -a $LOGFILE
            sudo apt-get install apt-transport-https --yes | tee -a $LOGFILE
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list | tee -a $LOGFILE
            sudo apt-get update | tee -a $LOGFILE
            sudo apt-get install helm | tee -a $LOGFILE

            echo "Labeling nodes for OpenWhisk..." | tee -a $LOGFILE
            sudo kubectl label node --all openwhisk-role=invoker | tee -a $LOGFILE

            echo "Installing OpenWhisk with Helm..." | tee -a $LOGFILE
            sudo helm install owdev ~/openwhisk-deploy-kube/helm/openwhisk -n openwhisk --create-namespace -f ~/openwhisk-deploy-kube/deploy/kind/mycluster.yaml | tee -a $LOGFILE

            echo "Downloading OpenWhisk CLI..." | tee -a $LOGFILE
            sudo wget https://github.com/apache/openwhisk-cli/releases/download/1.2.0/OpenWhisk_CLI-1.2.0-linux-386.tgz | tee -a $LOGFILE

            echo "Extracting OpenWhisk CLI..." | tee -a $LOGFILE
            tar -xzf OpenWhisk_CLI-1.2.0-linux-386.tgz | tee -a $LOGFILE

            echo "Moving wsk to /usr/local/bin..." | tee -a $LOGFILE
            sudo mv wsk /usr/local/bin/ | tee -a $LOGFILE

            echo "Setting OpenWhisk properties..." | tee -a $LOGFILE
            sudo wsk property set --apihost localhost:31001 | tee -a $LOGFILE
            sudo wsk property set --auth 23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP | tee -a $LOGFILE

            echo "OpenWhisk setup process completed successfully." | tee -a $LOGFILE
        fi
    } > $LOGFILE 2> $ERRORFILE || {
        echo "An error occurred. Check the error log file for details." | tee -a $LOGFILE
        exit 1
    }
else
    echo "Invalid choice. Please select option 1 or 2."
fi