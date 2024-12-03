#!/bin/bash

LOGFILE="env_setupOut.log"
ERRORFILE="env_setupOut.log"

cd ~

echo "Select an option:"
echo "1. Install SmartFasS setup"
echo "2. Install OpenWhisk setup"
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" -eq 1 ] || [ "$choice" -eq 2 ]; then
    {
        if [ "$choice" -eq 1 ] || [ "$choice" -eq 2 ]; then
            echo "Starting the SmartFasS environment setup process..." 

            echo "Updating package lists..." 
            sudo apt-get update

            echo "Installing required packages..." 
            sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

            echo "Adding Docker GPG key..." 
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

            echo "Adding Docker repository..." 
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

            echo "Updating package lists again..." 
            sudo apt-get update

            echo "Installing Docker..." 
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io

            echo "Checking Docker version..." 
            sudo docker --version

            echo "Downloading Docker Compose..." 
            sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

            echo "Making Docker Compose executable..." 
            sudo chmod +x /usr/local/bin/docker-compose

            echo "Checking Docker Compose version..." 
            docker-compose --version

            echo "Installing OpenJDK 11..." 
            sudo apt-get install -y openjdk-11-jdk

            echo "Checking Java version..." 
            java -version

            echo "Setting up Node.js repository..." 
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

            echo "Installing Node.js..." 
            sudo apt-get install -y nodejs

            echo "Downloading JMeter..." 
            sudo wget https://downloads.apache.org/jmeter/binaries/apache-jmeter-5.6.3.zip

            echo "Installing unzip..." 
            sudo apt-get install -y unzip

            echo "Unzipping JMeter..." 
            sudo unzip apache-jmeter-5.6.3.zip

            echo "Moving JMeter to /usr/local/bin..." 
            sudo mv apache-jmeter-5.6.3 /usr/local/bin/jmeter

            echo "Setting JMeter environment variables..." 
            echo 'export JMETER_HOME=/usr/local/bin/jmeter' >> ~/.bashrc
            echo 'export PATH=$JMETER_HOME/bin:$PATH' >> ~/.bashrc
            source ~/.bashrc

            echo "Checking JMeter version..." 
            jmeter --version

            echo "Adding Redis GPG key..." 
            curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

            echo "Setting permissions for Redis GPG key..." 
            sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg

            echo "Adding Redis repository..." 
            echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

            echo "Updating package lists again..." 
            sudo apt-get update

            echo "Installing Redis..." 
            sudo apt-get install -y redis

            echo "SmartFasS environment setup process completed successfully." 
        fi

        if [ "$choice" -eq 2 ]; then
            echo "Starting the OpenWhisk setup process..." 

            echo "Downloading kubectl..." 
            curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" 

            echo "Installing kubectl..." 
            sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl 

            echo "Checking kubectl version..." 
            kubectl version --client 

            echo "Downloading kind..." 
            [ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.25.0/kind-$(uname)-amd64 

            echo "Making kind executable..." 
            chmod +x ./kind 

            echo "Moving kind to /usr/local/bin..." 
            sudo mv ./kind /usr/local/bin/kind 

            echo "Cloning openwhisk-deploy-kube repository..." 
            git clone https://github.com/apache/openwhisk-deploy-kube.git 

            echo "Setting up Helm..." 
            curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null 
            sudo apt-get install apt-transport-https --yes 
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list 
            sudo apt-get update 
            sudo apt-get install helm 

            echo "Labeling nodes for OpenWhisk..." 
            sudo kubectl label node --all openwhisk-role=invoker 

            echo "Installing OpenWhisk with Helm..." 
            sudo helm install owdev ~/openwhisk-deploy-kube/helm/openwhisk -n openwhisk --create-namespace -f ~/openwhisk-deploy-kube/deploy/kind/mycluster.yaml 

            echo "Downloading OpenWhisk CLI..." 
            sudo wget https://github.com/apache/openwhisk-cli/releases/download/1.2.0/OpenWhisk_CLI-1.2.0-linux-386.tgz 

            echo "Extracting OpenWhisk CLI..." 
            tar -xzf OpenWhisk_CLI-1.2.0-linux-386.tgz 

            echo "Moving wsk to /usr/local/bin..." 
            sudo mv wsk /usr/local/bin/ 

            echo "Setting OpenWhisk properties..." 
            sudo wsk property set --apihost localhost:31001 
            sudo wsk property set --auth 23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP 

            echo "OpenWhisk setup process completed successfully." 
        fi
    } > $LOGFILE 2> $ERRORFILE || {
        echo "An error occurred. Check the error log file for details." 
        exit 1
    }
else
    echo "Invalid choice. Please select option 1 or 2."
fi