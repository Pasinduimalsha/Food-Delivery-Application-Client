variable "instance_type" {
    default = "t2.micro"
}

variable "region" {
    default = "us-east-1"
}

variable "ami"{
    default = "ami-0ecb62995f68bb549"
}

variable "key_name" {
    description = "Name of the AWS key pair to use for EC2 instances"
    type        = string
    default     = "sandatharu"
}