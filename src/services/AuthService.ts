export default class AuthService {
    async login(correo: string, password: string) {
        const response = await fetch("http://147.93.114.138:8091/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({correo:correo, password:password}),
        })


        return response.json()
    }
}
