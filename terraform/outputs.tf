output "food_ordering_client_deploy_server_ip" {
  description = "Public IP address of the deploy server"
  value       = aws_instance.food_ordering_client_deploy_server.public_ip
}