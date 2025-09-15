<?php 
session_start(); 

// Automaattinen uloskirjautuminen jos käyttäjä ei tee mitään 15 minuuttiin
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 900)) {
    session_unset(); // tyhjennetään istunto
    session_destroy(); // tuhotaan istunto
    header("Location: ../pages/login.html"); // ohjataan takaisin login-sivulle
    exit();
}
$_SESSION['LAST_ACTIVITY'] = time(); // päivitetään viimeinen aktiivisuus

// Jos käyttäjä ei ole kirjautunut, ohjataan kirjautumaan
if (!isset($_SESSION['user_id'])) { 
    header("Location: ../pages/login.html"); 
    exit(); 
} 
?>

<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>To-Do List</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>

<body>
  <!-- Yläpalkki navigointia varten -->
  <nav class="navbar">
    <div class="logo">To-Do</div>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <?php if (isset($_SESSION['user_id'])): ?>
        <!-- Näytetään jos käyttäjä on kirjautunut sisään -->
        <li><a href="../php/logout.php" id="logout-link">Logout</a></li>
        <!-- GDPR-toiminnot -->
        <li><a href="#" id="export-data-btn">Download My Data</a></li>
        <li><a href="#" id="delete-account-btn">Delete My Account</a></li>
      <?php else: ?>
        <!-- Jos ei kirjautunut, näytetään nämä -->
        <li><a href="../pages/login.html">Login</a></li>
        <li><a href="../pages/register.html">Register</a></li>
      <?php endif; ?>
    </ul>
  </nav>

  <main class="container">
    <!-- Varsinainen tehtävälista -->
    <div class="todo-card">
      <h2>My Tasks</h2>
      <form class="todo-form" id="task-form">
        <input type="text" id="task" placeholder="Add a new task..." required />
        <button type="submit">Add</button>
      </form>
      <ul class="todo-list" id="task-list"></ul>
      <!-- Linkki tietosuojakäytäntöön -->
      <p class="redirect">
        Lue <a href="privacy.html">tietosuojakäytäntö</a>.
      </p>
    </div>
  </main>

  <script src="../js/script.js"></script>
</body>
</html>
