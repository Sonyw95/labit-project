<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%>
<%@ taglib prefix="tilse" uri="http://tiles.apache.org/tags-tiles" %>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0">

<head>
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/main_head.css">
    <link rel="stylesheet" href="/css/main_common.css">
    <link rel="stylesheet" href="/css/styles.min.css">
    <link rel="stylesheet" href="/css/simplebar.css">
    <link rel="stylesheet" href="/css/tiny-slider.css">
    <link rel="icon" href="/img/main_logo.png">


    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>


    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- favicon -->
    <link rel="icon" href="img/favicon.ico">
    <title>LABIT | Home</title>
</head>


<body>


        <div class="head">
            <tiles:insertAttribute name="head"/>
        </div>

        <div class="side">
            <tiles:insertAttribute name="side"/>
        </div>

        <div class="contents">
            <tiles:insertAttribute name="content" />
        </div>

        <div class="foot">
            <tilse:insertAttribute name="foot"/>
        </div>


    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

    <!-- app -->
    <script src="/front/public/js/util/app.js"></script>
    <!-- page loader -->
    <script src="/js/utils/page-loader.js"></script>
    <!-- simplebar -->
    <script src="/js/vendor/simplebar.min.js"></script>
    <!-- liquidify -->
    <script src="/js/utils/liquidify.js"></script>
    <!-- XM_Plugins -->
    <script src="/js/vendor/xm_plugins.min.js"></script>
    <!-- tiny-slider -->
    <script src="/js/vendor/tiny-slider.min.js"></script>
    <!-- global.hexagons -->
    <script src="/front/public/js/util/global.hexagons.js"></script>
    <!-- global.tooltips -->
    <script src="/js/global/global.tooltips.js"></script>
    <!-- header -->
    <script src="/js/header/header.js"></script>
    <!-- sidebar -->
    <script src="/js/sidebar/sidebar.js"></script>
    <!-- content -->
    <script src="/js/content/content.js"></script>
    <!-- form.utils -->
    <script src="/js/form/form.utils.js"></script>
    <!-- SVG icons -->
    <script src="/js/utils/svg-loader.js"></script>

</body>





