import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pecas, setPecas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) carregarPecas();
    });
  }, []);

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const sair = async () => {
    await signOut(auth);
  };

  const carregarPecas = async () => {
    const pecasRef = collection(db, "pecas");
    const q = query(pecasRef, orderBy("descricao"));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPecas(lista);
  };

  const salvarPeca = async () => {
    const pecasRef = collection(db, "pecas");
    await addDoc(pecasRef, { descricao, codigo });
    setDescricao("");
    setCodigo("");
    carregarPecas();
  };

  if (!user) {
    return (
      <div className="p-4 max-w-sm mx-auto">
        <h1 className="text-xl mb-4">Login</h1>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={login}
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Estoque de Peças</h1>
        <button
          onClick={sair}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Sair
        </button>
      </div>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={salvarPeca}
        >
          Salvar
        </button>
      </div>

      <ul className="space-y-2">
        {pecas.map((peca) => (
          <li key={peca.id} className="border p-2 rounded">
            <strong>{peca.codigo}</strong>: {peca.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}
