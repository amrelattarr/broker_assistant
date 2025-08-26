import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  success: boolean;
  errorMessage: string | null;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    password: string;
    balance: number;
    buySellInvests: unknown;
    sendMessages: unknown;
  };
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7006/api/Auth';

  register(payload: RegisterRequestDto): Observable<unknown> {
    const url = `${this.baseUrl}/register`;
    return this.http.post(url, payload, {
      headers: { 'Content-Type': 'application/json', 'accept': '*/*' }
    });
  }

  login(payload: LoginRequestDto): Observable<LoginResponseDto> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<LoginResponseDto>(url, payload, {
      headers: { 'Content-Type': 'application/json', 'accept': '*/*' }
    });
  }
}


