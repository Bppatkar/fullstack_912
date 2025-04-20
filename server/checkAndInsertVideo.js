// import mongoose from "mongoose";
// import Video from "./models/video.model.js";

// const run = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(
//       "mongodb+srv://<username>:<password>@cluster0.mongodb.net/fullstack_912?retryWrites=true&w=majority"
//     );
//     console.log("Connected to MongoDB");

//     const videoId = "m28NrA9DKvk";

//     // Check if the video exists
//     const video = await Video.findOne({ videoId });
//     if (video) {
//       console.log("Video already exists:", video);
//     } else {
//       // Insert the video if it doesn't exist
//       const newVideo = new Video({
//         videoId: "your_video_id",
//         title: "your_video_title",
//         description: "your_video_description",

//         url: "youtube_video_url",
//         comments: [],
//         notes: [],
//       });
//       await newVideo.save();
//       console.log("New video inserted:", newVideo);
//     }

//     // Close the connection
//     mongoose.connection.close();
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// run();
