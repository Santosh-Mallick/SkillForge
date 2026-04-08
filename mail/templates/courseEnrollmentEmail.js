exports.courseEnrollmentEmail = (userName, courseName) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #4f46e5;
        color: white;
        text-align: center;
        padding: 20px;
      }
      .content {
        padding: 30px;
        color: #333;
      }
      .content h2 {
        margin-top: 0;
      }
      .course-box {
        background-color: #f1f5f9;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
        font-weight: bold;
      }
      .button {
        display: inline-block;
        padding: 12px 20px;
        background-color: #4f46e5;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        padding: 20px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      
      <div class="header">
        <h1>🎉 Enrollment Confirmed!</h1>
      </div>

      <div class="content">
        <h2>Hello ${userName},</h2>
        <p>
          Congratulations! You have successfully enrolled in the course:
        </p>

        <div class="course-box">
          ${courseName}
        </div>

        <p>
          We're excited to have you onboard. Start learning and enjoy your journey 🚀
        </p>

        <a href="#" class="button">Go to Course</a>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Your Platform Name. All rights reserved.</p>
      </div>

    </div>
  </body>
  </html>
  `;
};