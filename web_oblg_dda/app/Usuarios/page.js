"use client";
import { tomarUsuarios } from "../../api/api";
import { useEffect, useState } from "react";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([
    { nombre: "pepe", email: "juan@gmail.com", id: "1" },
  ]);

  useEffect(() => {
    tomarUsuarios().then((data) => setUsuarios(data));
  }, []);
  console.log("USUARIOS", usuarios);

  return (
    <div>
      {usuarios.map((user) => (
        <p key={user.id}>
          {user.nombre} - {user.email}
        </p>
      ))}
    </div>
  );
}
