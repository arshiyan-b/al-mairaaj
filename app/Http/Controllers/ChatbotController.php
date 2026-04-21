<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{

    public function index()
    {
        return view("chatbot.index");
    }
    public function chat(Request $request)
    {
        // Get user question from frontend
        $question = $request->input('message', 'Who was carl marx?');

        // Call Ollama API
        $response = Http::timeout(120)->post('http://127.0.0.1:11434/api/generate', [
            'model' => 'llama3:8b',
            'prompt' => $question,
            'stream' => false,
        ]);

        // Decode JSON response
        $data = $response->json();

        // Extract answer
        $answer = $data['response'] ?? 'No response from model';

        // For debugging, dump answer
        dd($answer);

        // Later, return as JSON to frontend
        // return response()->json(['question' => $question, 'answer' => $answer]);
    }

}