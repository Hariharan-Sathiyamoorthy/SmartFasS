#!/bin/bash

set -e

LOGFILE="output.log"
ERRORFILE="error.log"

cd ~

{
    echo "Starting the environment setup process..." 

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


    echo "Adding Redis GPG key..." 
    curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

    echo "Setting permissions for Redis GPG key..." 
    sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg

    echo "Adding Redis repository..." 
    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

    echo "Updating package lists again..." 
    sudo apt-get update

    echo "Installing Redis..." 
    sudo apt-get install redis

    echo "Environment setup process completed successfully." 
} > $LOGFILE 2> $ERRORFILE || {
    echo "An error occurred. Check the error log file for details." 
    exit 1
}