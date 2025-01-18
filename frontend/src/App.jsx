import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [formData, setFormData] = useState({ name: "", image: "", summary: "" });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null); // Ref for the image input field

  // Fetch movies from the server
  useEffect(() => {
    axios
      .get("http://localhost:1000/data")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch DATA. Please try again.");
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "image") {
      setFormData({ ...formData, image: files[0]?.name || "" });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:1000/data", formData);

      if (response.data) {
        setMovies((prevMovies) => [...prevMovies, response.data]);
        toast.success("Data added successfully!");
      }

      setFormData({ name: "", image: "", summary: "" }); // Clear the form
      if (imageInputRef.current) imageInputRef.current.value = ""; // Reset the image input field
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("All fields are required");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit action
  const handleEdit = (movie) => {
    setFormData({
      name: movie.name,
      image: movie.image,
      summary: movie.summary,
    });
    if (imageInputRef.current) imageInputRef.current.value = ""; // Clear the image input field
    toast.info("Edit mode activated. Make changes and submit.");
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:1000/data", { data: { _id: id } });
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
      toast.success("Data deleted successfully!");
    } catch (err) {
      console.error("Error deleting data:", err);
      toast.error("Failed to delete the data. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-10 items-center justify-center w-full h-screen">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 items-center justify-center w-96 p-5 border rounded-lg shadow-lg"
        >
          <label className="w-full rounded p-1">Name</label>
          <input
            className="w-full rounded p-2 border-black border-2"
            id="name"
            type="text"
            placeholder="Enter movie name"
            value={formData.name}
            onChange={handleChange}
          />

          <label className="w-full rounded p-1">Select Image</label>
          <input
            className="w-full rounded p-2 border-black border-2"
            id="image"
            accept="image/*"
            type="file"
            onChange={handleChange}
            ref={imageInputRef} // Attach the ref to the image input
          />

          <label className="w-full rounded p-1">Summary</label>
          <textarea
            className="w-full rounded p-2 border-black border-2"
            id="summary"
            placeholder="Enter summary of movie"
            value={formData.summary}
            onChange={handleChange}
          ></textarea>

          <button
            className="w-full bg-black text-white p-1 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Table Section */}
        <div className="flex items-center justify-center w-full">
          <table className="border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Name</th>
                <th className="border border-gray-400 px-4 py-2">Image</th>
                <th className="border border-gray-400 px-4 py-2">Summary</th>
                <th className="border border-gray-400 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2">{movie.name}</td>
                  <td className="border border-gray-400 px-4 py-2">{movie.image}</td>
                  <td className="border border-gray-400 px-4 py-2">{movie.summary}</td>
                  <td className="border border-gray-400 px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEdit(movie)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(movie._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
