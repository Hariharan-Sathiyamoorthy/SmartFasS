#!/bin/bash

LOGFILE="process.log"
ERRORFILE="error.log"

{
    echo "Starting the process..." | tee -a $LOGFILE

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

    echo "Process completed successfully." | tee -a $LOGFILE
} 2> $ERRORFILE