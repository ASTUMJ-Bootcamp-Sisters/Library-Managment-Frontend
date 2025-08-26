import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";

const BookForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    available: "",
    language: "",
    isbn: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        title: "",
        author: "",
        category: "",
        available: "",
        language: "",
        isbn: "",
        description: "",
        image: "",
      });
  }, [initialData, open]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Book" : "Add Book"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="available">Available</Label>
            <Input id="available" name="available" type="number" value={formData.available} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="language">Language</Label>
            <Input id="language" name="language" value={formData.language} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" value={formData.image} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-black text-white">{initialData ? "Update" : "Add"}</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookForm;
