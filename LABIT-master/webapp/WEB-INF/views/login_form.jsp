<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="tilse" uri="http://tiles.apache.org/tags-tiles" %>

<!-- LANDING -->
<div class="landing">
    <!-- LANDING DECORATION -->
    <div class="landing-decoration"></div>
    <!-- /LANDING DECORATION -->

    <!-- LANDING INFO -->
    <div class="landing-info">
        <!-- LOGO -->
        <div class="logo">
            <!-- ICON LOGO VIKINGER -->
            <img class="icon-logo-vikinger" src="/img/main_logo.png"/>
            <!-- /ICON LOGO VIKINGER -->
        </div>
        <!-- /LOGO -->

        <!-- LANDING INFO PRETITLE -->
        <h2 class="landing-info-pretitle">Welcome to</h2>
        <!-- /LANDING INFO PRETITLE -->

        <!-- LANDING INFO TITLE -->
        <h1 class="landing-info-title">LABIT!</h1>
        <!-- /LANDING INFO TITLE -->

        <!-- LANDING INFO TEXT -->
        <p class="landing-info-text">IT  social network &amp; community! 많은 공유 부탁드립니다!  </p>
        <!-- /LANDING INFO TEXT -->

        <!-- TAB SWITCH -->
        <div class="tab-switch">
            <!-- TAB SWITCH BUTTON -->
            <p class="tab-switch-button login-register-form-trigger">Login</p>
            <!-- /TAB SWITCH BUTTON -->

            <!-- TAB SWITCH BUTTON -->
            <p class="tab-switch-button login-register-form-trigger">Register</p>
            <!-- /TAB SWITCH BUTTON -->
        </div>
        <!-- /TAB SWITCH -->
    </div>
    <!-- /LANDING INFO -->

    <!-- LANDING FORM -->
    <div class="landing-form">
        <!-- FORM BOX -->
        <div class="form-box login-register-form-element">
            <!-- FORM BOX DECORATION
            <img class="form-box-decoration overflowing" src="img/landing/rocket.png" alt="rocket"> -->
            <!-- /FORM BOX DECORATION -->

            <!-- FORM BOX TITLE -->
            <h2 class="form-box-title">Account Login</h2>
            <!-- /FORM BOX TITLE -->

            <!-- FORM -->
            <form class="form" id="loginForm" name="loginForm">
                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM INPUT -->
                        <div class="form-input">
                            <label for="userid">UserId</label>
                            <input type="text" id="userid" name="userid">
                        </div>
                        <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM INPUT -->
                        <div class="form-input">
                            <label for="idpassword">Password</label>
                            <input type="password" id="idpassword" name="idpassword">
                        </div>
                        <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row space-between">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- CHECKBOX WRAP -->
                        <div class="checkbox-wrap">
                            <input type="checkbox" id="login-remember" name="login_remember" checked>
                            <!-- CHECKBOX BOX -->
                            <div class="checkbox-box">
                                <!-- ICON CROSS -->
                                <svg class="icon-cross">
                                    <use xlink:href="#svg-cross"></use>
                                </svg>
                                <!-- /ICON CROSS -->
                            </div>
                            <!-- /CHECKBOX BOX -->
                            <label for="login-remember">Remember Me</label>
                        </div>
                        <!-- /CHECKBOX WRAP -->
                    </div>
                    <!-- /FORM ITEM -->

                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM LINK -->
                        <a class="form-link" href="#">Forgot Password?</a>
                        <!-- /FORM LINK -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- BUTTON -->
                        <span class="button medium secondary" onclick="loginMember();">Login to your Account!</span>
                        <!-- /BUTTON -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->
            </form>
            <!-- /FORM -->

            <!-- LINED TEXT -->
            <p class="lined-text">Login with your Social Account</p>
            <!-- /LINED TEXT -->

            <!-- SOCIAL LINKS -->
            <div class="social-links">

                <!-- SOCIAL LINK -->
                <a class="social-link kakao" href="#">
                    <!-- ICON FACEBOOK -->
                    <img class="icon-kakao" src="/img/KakaoTalk_logo.png"/>
                    <!-- /ICON FACEBOOK -->
                </a>
                <!-- /SOCIAL LINK -->

                <!-- SOCIAL LINK -->
                <a class="social-link facebook" href="#">
                    <!-- ICON FACEBOOK -->
                    <svg class="icon-facebook">
                        <use xlink:href="#svg-facebook"></use>
                    </svg>
                    <!-- /ICON FACEBOOK -->
                </a>
                <!-- /SOCIAL LINK -->

                <!-- SOCIAL LINK -->
                <a class="social-link twitter" href="#" >
                    <!-- ICON TWITTER -->
                    <svg class="icon-twitter">
                        <use xlink:href="#svg-twitter"></use>
                    </svg>
                    <!-- /ICON TWITTER -->
                </a>
                <!-- /SOCIAL LINK -->

                <!-- SOCIAL LINK -->
                <a class="social-link twitch" href="#">
                    <!-- ICON TWITCH -->
                    <svg class="icon-twitch">
                        <use xlink:href="#svg-twitch"></use>
                    </svg>
                    <!-- /ICON TWITCH -->
                </a>
                <!-- /SOCIAL LINK -->

                <!-- SOCIAL LINK -->
                <a class="social-link youtube" href="#">
                    <!-- ICON YOUTUBE -->
                    <svg class="icon-youtube">
                        <use xlink:href="#svg-youtube"></use>
                    </svg>
                    <!-- /ICON YOUTUBE -->
                </a>
                <!-- /SOCIAL LINK -->
            </div>
            <!-- /SOCIAL LINKS -->
        </div>
        <!-- /FORM BOX -->

        <!-- FORM BOX -->
        <div class="form-box login-register-form-element">
            <!-- FORM BOX DECORATION
            <img class="form-box-decoration" src="img/landing/rocket.png" alt="rocket"> -->
            <!-- /FORM BOX DECORATION -->

            <!-- FORM BOX TITLE -->
            <h2 class="form-box-title">Create your Account!</h2>
            <!-- /FORM BOX TITLE -->

            <!-- FORM -->
            <form class="form registForm" id="registForm" name="registForm">
                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM INPUT -->
                        <div class="form-input">
                            <label for="reg-userid">Your ID</label>
                            <input type="text" class="reg-input" id="reg-userid" name="userid">
                        </div>
                        <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM INPUT -->
                        <div class="form-input">
                            <label for="reg-email">Your Email</label>
                            <input type="text" class="reg-input" id="reg-email" name="email">
                        </div>
                        <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row reg-auth-email" style="display: none;">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM INPUT -->
                        <div class="form-input">
                            <label for="reg-auth-email">CODE</label>
                            <input type="text" class="reg-chk-input" id="reg-auth-email" name="authcode" maxlength="5">
                        </div>
                        <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM INPUT -->
                        <div class="form-input">
                            <label for="reg-username">Username</label>
                            <input type="text" class="reg-input" id="reg-username" name="username">
                        </div>
                        <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM INPUT -->
                        <div class="form-input">
                            <label for="reg-idpassword">Password</label>
                            <input type="password" class="reg-input" id="reg-idpassword" name="idpassword">
                        </div>
                        <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- FORM INPUT -->
                        <div class="form-input">
                            <label for="reg-chkpassword">Repeat Password</label>
                            <input type="password" class="reg-input reg-chk-input" id="reg-chkpassword" name="chkpassword" >
                        </div>
                        <!-- /FORM INPUT -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- CHECKBOX WRAP -->
                        <div class="checkbox-wrap">
                            <input type="checkbox" id="register-newsletter"  checked>
                            <!-- CHECKBOX BOX -->
                            <div class="checkbox-box">
                                <!-- ICON CROSS -->
                                <svg class="icon-cross">
                                    <use xlink:href="#svg-cross"></use>
                                </svg>
                                <!-- /ICON CROSS -->
                            </div>
                            <!-- /CHECKBOX BOX -->
                            <label for="register-newsletter">Send me news and updates via email</label>
                        </div>
                        <!-- /CHECKBOX WRAP -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->

                <!-- FORM ROW -->
                <div class="form-row">
                    <!-- FORM ITEM -->
                    <div class="form-item">
                        <!-- BUTTON -->
                        <span class="button medium primary" onclick="registMember();">Register Now!</span>
                        <!-- /BUTTON -->
                    </div>
                    <!-- /FORM ITEM -->
                </div>
                <!-- /FORM ROW -->
            </form>
            <!-- /FORM -->

            <!-- FORM TEXT -->
            <p class="form-text">You'll receive a confirmation email in your inbox with a link to activate your account. If you have any problems, <a href="#">contact us</a>!</p>
            <!-- /FORM TEXT -->
        </div>
        <!-- /FORM BOX -->
    </div>
    <!-- /LANDING FORM -->
</div>