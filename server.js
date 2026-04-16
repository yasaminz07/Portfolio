require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function requireAdmin(req, res, next) {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      message: "Incorrect Admin Key",
    });
  }
  next();
}

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  const insertQuery = `
    INSERT INTO inquiries (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [name, email, subject, message],
    async function (dbError) {
      if (dbError) {
        console.error("Database insert error:", dbError.message);
        return res.status(500).json({
          success: false,
          message: "Failed to save inquiry.",
        });
      }

      try {
        await transporter.sendMail({
          from: `"Yasamin Portfolio" <${process.env.EMAIL_USER}>`,
          to: process.env.RECEIVER_EMAIL,
          replyTo: email,
          subject: `Portfolio Contact: ${subject}`,
          text: `
New portfolio message

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `,
          html: `
          <h2>New portfolio message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
        });

        await transporter.sendMail({
          from: `"Yasamin Zaid" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Thanks for your message",
          text: `
Hi ${name},

Thank you for reaching out through my portfolio website.

I have received your message regarding:
${subject}

Your message:
${message}

I will get back to you as soon as possible.

Best wishes,
Yasamin Zaid
        `,
          html: `
          <p>Hi ${name},</p>
          <p>Thank you for reaching out through my portfolio website.</p>
          <p>I have received your message regarding:</p>
          <p><strong>${subject}</strong></p>
          <p><strong>Your message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <p>I will get back to you as soon as possible.</p>
          <p>Best wishes,<br>Yasamin Zaid</p>
        `,
        });

        res.json({
          success: true,
          message: "Message sent successfully.",
        });
      } catch (emailError) {
        console.error("Email error:", emailError);

        res.status(500).json({
          success: false,
          message: "Inquiry saved, but email sending failed.",
        });
      }
    },
  );
});

app.get("/api/inquiries", requireAdmin, (req, res) => {
  db.all(
    "SELECT * FROM inquiries ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        console.error("Fetch inquiries error:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch inquiries.",
        });
      }

      res.json({
        success: true,
        inquiries: rows,
      });
    },
  );
});

app.patch("/api/inquiries/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { replied, resolved } = req.body;

  let status = "new";

  if (replied && resolved) {
    status = "replied & resolved";
  } else if (resolved) {
    status = "resolved";
  } else if (replied) {
    status = "replied";
  }

  db.run(
    `
      UPDATE inquiries
      SET replied = ?, resolved = ?, status = ?
      WHERE id = ?
    `,
    [replied ? 1 : 0, resolved ? 1 : 0, status, id],
    function (err) {
      if (err) {
        console.error("Update inquiry error:", err.message);
        return res.status(500).json({
          success: false,
          message: "Failed to update inquiry.",
        });
      }

      res.json({
        success: true,
        message: "Inquiry updated successfully.",
      });
    },
  );
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.put("/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const { replied, resolved, status } = req.body;

  db.run(
    `UPDATE inquiries SET replied = ?, resolved = ?, status = ? WHERE id = ?`,
    [replied, resolved, status, id],
    function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to update inquiry",
        });
      }

      res.json({
        success: true,
        message: "Inquiry updated",
      });
    },
  );
});

// delete db - code

app.delete("/api/inquiries/:id", (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  const { id } = req.params;

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  db.run("DELETE FROM inquiries WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Delete inquiry error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete inquiry.",
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    res.json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  });
});

app.post("/api/inquiries/delete-multiple", express.json(), (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  const { ids } = req.body;

  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No inquiry IDs provided.",
    });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `DELETE FROM inquiries WHERE id IN (${placeholders})`;

  db.run(sql, ids, function (err) {
    if (err) {
      console.error("Delete multiple inquiries error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to delete inquiries.",
      });
    }

    res.json({
      success: true,
      message: `${this.changes} inquiry/inquiries deleted successfully.`,
    });
  });
});
