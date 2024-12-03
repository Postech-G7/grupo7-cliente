import { Cliente } from "./cliente";
import { ClienteVersao } from "./cliente.versao";

describe("ClienteEntities", () => {
  const cliente = new Cliente(
    "11111111111",
    "Marina Altoé",
    "marina@gmail.com",
    "ht6BpgWyKPV5yuJ9YW0nAOz1alA3",
    new ClienteVersao(
      "66f8b752fde267906149c412",
      new Date("2024-11-29T02:11:30.000Z")
    )
  );
  it("should create a new Cliente", () => {
    expect(cliente).toBeInstanceOf(Cliente);
  });
  it("should return the CPF", () => {
    expect(cliente.getCpf()).toBe("11111111111");
  });
  it("should return the name", () => {
    expect(cliente.getNome()).toBe("Marina Altoé");
  });
  it("should return the email", () => {
    expect(cliente.getEmail()).toBe("marina@gmail.com");
  });
  it("should return the identity", () => {
    expect(cliente.getIdentity()).toBe("ht6BpgWyKPV5yuJ9YW0nAOz1alA3");
  });
  it("should set the identity", () => {
    cliente.setIdentity("ht6BpgWyKPV5yuJ9YW0nAOz1alA3");
    expect(cliente.getIdentity()).toBe("ht6BpgWyKPV5yuJ9YW0nAOz1alA3");
  });
  it("should return the version", () => {
    expect(cliente.getVersao()).toBeInstanceOf(ClienteVersao);
    expect(cliente.getVersao()?.versao).toBe("66f8b752fde267906149c412");
  });
  it("should compare two clients", () => {
    const cliente2 = new Cliente(
      "11111111111",
      "Marina Altoé",
      "marinaupdated@gmail.com"
    );
    expect(cliente.equals(cliente2)).toBe(false);
    expect(cliente.equals(cliente)).toBe(true);
  });
});
