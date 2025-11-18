import React, { useState } from "react";
import ProfileModal from "../src/components/profileModal";
import Button from "../src/components/Button";

export default function Register() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        name="Edit Profile"
        backgroundColor="black"
        color="white"
        onClick={() => setOpen(true)}
      />

      <ProfileModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
