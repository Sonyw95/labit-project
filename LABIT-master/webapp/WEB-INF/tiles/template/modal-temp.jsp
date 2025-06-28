<%--
  Created by IntelliJ IDEA.
  User: son
  Date: 2022-08-01
  Time: 오후 11:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>



<div class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">알림!</h5>
            </div>
            <div class="modal-body">
                <p id="modal-text"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closeModal();">닫기</button>
            </div>
        </div>
    </div>
</div>
