import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    // ref links this field to a document in the "User" collection
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    // null means "not returned yet"
    returnDate: { type: Date, default: null },
  },
  { timestamps: true },
);

const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);

export default BorrowRecord;
