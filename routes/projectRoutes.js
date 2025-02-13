const express = require("express");
const router = express.Router();
const { Project, User } = require("../models/index.js");
const ensureAuthenticated = require("../middleware/auth.js");

const mongoose = require("mongoose");

// Create new project
router.post("/", ensureAuthenticated, async (req, res) => {
    try {
        // First, check if the user exists in MongoDB
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({
                error: "User not found in database. Please complete your profile first.",
            });
        }

        console.log("\n", req.body);
        // If user exists, proceed with project creation
        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            percentDone: Number(req.body.percent_done),
            // TODO Add Tags
            owner: {
                _id: user._id,
                username: user.username,
            },
            contributors: [
                {
                    _id: user._id,
                    username: user.username,
                },
            ], // Owner is automatically a contributor
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        await project.save();
        res.status(201).json({
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Error in /submit route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update project details
router.patch("/:id", ensureAuthenticated, async function (req, res) {
    try {
        const projectId = req.params.id;

        // Validate ObjectId first
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ error: "Invalid project ID format" });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Check if user is owner or contributor
        if (
            project.owner._id.toString() !== req.user._id.toString() &&
            !project.contributors.some(
                (c) => c.toString() === req.user._id.toString()
            )
        ) {
            return res.status(403).json({
                error: "Forbidden: You are not authorized to update this project",
            });
        }

        // Update project fields
        project.title = req.body.title;
        project.description = req.body.description;
        project.percentDone = req.body.percentDone;
        project.updatedAt = Date.now();

        await project.save();

        // Return JSON response instead of redirect
        return res.json({
            message: "Project updated successfully",
            project: project,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
});

// Delete a project by its project ID.
router.delete("/:id", ensureAuthenticated, async function (req, res) {
    try {
        const projectId = req.params.id;

        // Validate ObjectId first
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).send("Invalid project ID format.");
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).send("Project not found.");
        }

        // Check if the user is the owner or an admin.
        if (
            project.owner._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .send(
                    "Forbidden: You are not authorized to delete this project."
                );
        }

        await Project.findByIdAndDelete(projectId);
        //after deletion user should be redirected to home page
        res.json({ message: "Project deleted successfully." });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).send("Internal Server Error.");
    }
});

/*****
 * Routes for serving project pages
 **/

// These routes serve the pages that list projects.
// We don't require authentication for this page. Anyone can view projects.
router.get(["/tables", "/cards"], function (req, res) {
    console.log("Authenticated");
    Project.find()
        .populate("owner", "username email")
        .populate("contributors", "username email")
        .then(function (projects) {
            console.log("projects", projects);
            if (req.url === "/tables") {
                res.render("tables", { projects, user: req.user });
            } else if (req.url === "/cards") {
                res.render("cards", { projects, user: req.user });
            }
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});

// This route serves the new project form page.
router.get("/submit", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("submit", { user: req.user });
    } else {
        res.redirect("/login");
    }
});

// This route serves the page for editing a given project
// Updated edit route to handle projects
// Edit a project
router.get("/edit/:id", ensureAuthenticated, function (req, res) {
    Project.findById(req.params.id)
        .populate("owner")
        .populate("contributors")
        .then((project) => {
            if (!project) {
                return res.status(404).send("Project not found");
            }
            // Check if the user is the owner or a contributor
            if (
                project.owner._id.toString() !== req.user._id.toString() &&
                !project.contributors.some(
                    (c) => c._id.toString() === req.user._id.toString()
                )
            ) {
                return res
                    .status(403)
                    .send(
                        "Forbidden: You are not authorized to edit this project."
                    );
            }
            res.render("edit", { project, user: req.user });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Internal Server Error");
        });
});

module.exports = router;
