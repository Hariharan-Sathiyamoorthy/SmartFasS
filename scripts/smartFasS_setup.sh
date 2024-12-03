#!/bin/bash

set -e

LOGFILE="output.log"
ERRORFILE="error.log"

{
    echo "Starting the environment setup process..." | tee -a $LOGFILE

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

    echo "Environment setup process completed successfully." | tee -a $LOGFILE
} > $LOGFILE 2> $ERRORFILE || {
    echo "An error occurred. Check the error log file for details." | tee -a $LOGFILE
    exit 1
}