terraform {
  backend "s3" {
    bucket = "food-delivery-terraform-state-pasindu"
    key    = "food-delivery-client/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws"{
    region = var.region
}