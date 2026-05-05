<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" class="{{ $class }}">
  <!-- Background transparent -->
  <rect width="300" height="100" fill="transparent"/>

  <!-- Ballot box with checkmark -->
  <g fill="#000">
    <rect x="10" y="30" width="40" height="40" rx="5"/>
    <path d="M15 50 L25 60 L45 35" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 25 C25 20, 15 20, 10 25" stroke="white" stroke-width="3" fill="none"/>
    <path d="M30 20 C20 10, 10 10, 0 20" stroke="white" stroke-width="3" fill="none"/>
  </g>

  <!-- Text: VoteHub -->
  <text x="60" y="60" font-family="Arial, sans-serif" font-size="36" fill="#000" font-weight="bold">
    VoteHub
  </text>
</svg>