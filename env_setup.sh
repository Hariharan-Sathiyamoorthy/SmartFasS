#!/bin/bash

set -e

LOGFILE="output.log"
ERRORFILE="error.log"

{
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    sudo docker --version
    sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    docker-compose --version
    sudo apt-get install -y openjdk-11-jdk
    java -version
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo wget https://downloads.apache.org/jmeter/binaries/apache-jmeter-5.6.3.zip
    mkdir jmeter
    sudo apt-get install -y unzip
    sudo unzip apache-jmeter-5.6.3.zip
    sudo mv apache-jmeter-5.6.3/* jmeter
    sudo mv jmeter /usr/local/bin/jmeter
    echo 'export JMETER_HOME=/usr/local/bin/jmeter' >> ~/.bashrc
    echo 'export PATH=$JMETER_HOME/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    jmeter --version
    curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
    sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
    sudo apt-get update
    sudo apt-get install redis
} > $LOGFILE 2> $ERRORFILE || {
    echo "An error occurred. Check the error log file for details."
    exit 1
}