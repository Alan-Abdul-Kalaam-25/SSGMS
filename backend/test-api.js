const axios = require("axios");

// Test the signup endpoint
async function testSignup() {
  try {
    const response = await axios.post("http://localhost:3001/api/auth/signup", {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      university: "Test University",
      year: "sophomore",
      major: "Computer Science",
    });

    console.log("✅ Signup successful:", response.data);
  } catch (error) {
    console.log("❌ Signup failed:");
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data);
    console.log("Message:", error.message);
  }
}

// Test health endpoint first
async function testHealth() {
  try {
    const response = await axios.get("http://localhost:3001/api/health");
    console.log("✅ Health check:", response.data);
  } catch (error) {
    console.log("❌ Health check failed:", error.message);
  }
}

async function runTests() {
  await testHealth();
  await testSignup();
}

runTests();
