import { Injectable } from "@nestjs/common";
import axios from "axios";
@Injectable()
export class AuthService {
	constructor() {}

	private readonly config = {
		headers: {
			Authorization: `Bearer ${process.env.AUTHORIZATION}`,
			serviceName: process.env.ELECTRICITY_PAY_BILL,
		},
		params: {},
	};

	async verifyPartnerToken(token: any): Promise<any> {
		try {
			console.log("cal here");
			//const url = `http://localhost:4941/api/authentication-service/v1/protected`;
			// const url = `https://api-digigo.dev-sheba.xyz/auth-api/authentication-service/v1/protected`;
			const url = `${process.env.BACKEND_API_URL || 'https://api-digigo.dev-sheba.xyz'}/auth-api/authentication-service/v1/protected`;
			const payload = {
				headers: {
					Authorization: token,
				},
			};
			const response = await axios.get(url, payload);
			return response?.data;
		} catch (error) {
			console.error(
				"error: ",
				error.response ? error.response.data : error.message,
			);
			throw error;
		}
	}

	async getServiceToken(serviceName: string): Promise<any> {
		try {
			const url = `https://digigo-auth-service.dev-sheba.xyz/api/authentication-service/v1/protected`;
			this.config["params"] = {
				serviceName: serviceName,
			};
			const response = await axios.get(url, this.config);

			return response?.data?.data;
		} catch (error) {
			throw error;
		}
	}
}
