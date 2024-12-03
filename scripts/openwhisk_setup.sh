#!/bin/bash

LOGFILE="process.log"
ERRORFILE="error.log"
cd ~

{
    echo "Starting the process..." 

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

    echo "Process completed successfully." 
} 2> $ERRORFILE