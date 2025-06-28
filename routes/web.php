<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard/course', function () {
    return view('course-evaluation');
})->middleware(['auth', 'verified'])->name('course.evaluation');

Route::get('/dashboard/itsupport', function () {
    return view('it-support');
})->middleware(['auth', 'verified'])->name('itsupport');

Route::get('/dashboard/itsupport-student', function () {
    return view('it-support-student');
})->middleware(['auth', 'verified'])->name('itsupport-student');

Route::get('/dashboard/cafeteria-student', function () {
    return view('cafeteria-student');
})->middleware(['auth', 'verified'])->name('cafeteria-student');

Route::get('/dashboard/class-student', function () {
    return view('class-student');
})->middleware(['auth', 'verified'])->name('class-student');

Route::get('/dashboard/user-management', function () {
    return view('user-management');
})->middleware(['auth', 'verified'])->name('user-management');

Route::get('/dashboard/course-feedback-faculty', function () {
    return view('course-feedback-faculty');
})->middleware(['auth', 'verified'])->name('course-feedback-faculty');







Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
