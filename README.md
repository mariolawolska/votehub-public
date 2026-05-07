🌟 VoteHub Public — Senior‑Level Full‑Stack Architecture Overview
VoteHub is a modern, API‑driven movie discovery and voting platform, designed and implemented with a strong focus on scalability, modularity and clean system boundaries.
This public repository presents selected parts of the architecture to demonstrate how I design, structure and deliver production‑ready features as a Senior Full‑Stack Engineer.

To nie jest demo — to wycinek realnej architektury, pokazujący sposób myślenia, decyzje techniczne i standardy inżynierskie.

🚀 What This Repository Represents
This project highlights how I approach:

end‑to‑end feature ownership

system design and modular architecture

clean API boundaries between independent platforms

predictable data flow and resource modelling

secure authentication flows (JWT + OAuth + session)

performance‑aware frontend and backend design

maintainable, testable code with clear intent

VoteHub is built the way I build real products:
clear separation of concerns, scalable patterns, and production‑ready decisions.

🌐 Live Demo
Frontend (React / Vite SPA)
https://node.marbar.co.uk/

Backend (Laravel API + Admin Panel)
https://laravel.marbar.co.uk/

These environments are provided for architectural and technical review.

🧩 High‑Level Architecture
VoteHub consists of two independent platforms communicating through a clean REST API:

Frontend (React + Vite)
A modern SPA designed for performance and clarity:

JWT authentication

filtering, sorting, debouncing, autosuggest

category popularity charts

WebP‑optimised images

reusable hooks encapsulating business logic

stateless, composable UI components

predictable state management

pure utilities with full test coverage

Backend (Laravel API)
A structured, service‑oriented backend providing:

REST API with consistent resource modelling

JWT authentication for the frontend

TMDB API integrations

category popularity aggregation

WebP image optimisation pipeline

clear separation of Web (session) and API (JWT) layers

controllers focused on orchestration, not logic

expressive Eloquent models with scopes and relationships

Admin Panel (Laravel Blade)
A secure, role‑isolated administrative interface with:

Google OAuth login

Laravel session login (email + password)

full CRUD for movies, categories and metadata

separate authentication flow from the public SPA

This separation ensures strong security and clean boundaries between public and administrative responsibilities.

🔥 Senior‑Level Engineering Focus
The code samples in this repository highlight:

clean, modular architecture

reusable abstractions and predictable patterns

separation of concerns across layers

testable logic with clear intent

performance‑aware design decisions

consistent API structure and domain modelling

real‑world engineering practices used in production systems

This is the way I design and deliver features as a senior engineer — with clarity, scalability and long‑term maintainability in mind.

📦 Frontend (React / Vite)
Included examples demonstrate:

reusable hooks for filtering, sorting, debouncing, data transformation

stateless UI components with clean props API

pure utilities with unit tests

predictable state management

page‑level orchestration and routing structure

Vitest/Jest tests for hooks, utils and components

🛠 Backend (Laravel)
Included backend samples illustrate:

service‑oriented architecture

controllers focused on orchestration

resource classes for consistent API responses

expressive Eloquent models with scopes, casts and relationships

clean routing structure (Web vs API)

domain logic separated from HTTP layer

📚 Documentation Included
architecture.md — system structure, reasoning and design decisions

tests.md — testing strategy and examples

🎯 Purpose of This Public Version
This repository is intentionally curated to provide a clear, senior‑level view of:

how I design systems

how I structure codebases

how I approach maintainability and scalability

how I think about architecture and boundaries

how I deliver production‑ready features end‑to‑end

It’s a focused, high‑value representation of my engineering approach.

📩 Contact
If you’d like to discuss the architecture, design decisions or implementation details, feel free to reach out.
