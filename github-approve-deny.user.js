// ==UserScript==
// @name GitHub Approve/Deny
// @namespace http://github.com/cisox/github-approve-deny
// @description Adds Approve and Deny buttons to GitHub pull requests and parses pull request comments for Approve/Deny text.
// @match https://github.com/*/*/pull/*
// @match http://github.com/*/*/pull/*
// @match https://www.github.com/*/*/pull/*
// @match http://www.github.com/*/*/pull/*
// @version 1.1
// @icon https://raw.github.com/cisox/github-approve-deny/master/github.png
// @downloadURL https://raw.github.com/cisox/github-approve-deny/master/github-approve-deny.user.js
// @updateURL https://raw.github.com/cisox/github-approve-deny/master/github-approve-deny.user.js
// ==/UserScript==

(function() {
    var comments = document.getElementsByClassName('js-comment-body');

    for (var idx = 0; idx < comments.length; idx++) {
        if (!comments[idx].children || comments[idx].children.length === 0) {
            continue;
        }

        var paragraph = comments[idx].children[0];
        if (!paragraph) {
            continue;
        }

        if (paragraph.innerHTML.indexOf('+1 Approve') !== -1) {
            paragraph.innerHTML = paragraph.innerHTML.replace('+1 Approve', '');

            var approval = document.createElement('div');
            approval.className = 'state state-open js-comment-approved';
            approval.style.width = '100%';
            approval.appendChild(document.createTextNode('Approved'));

            if (paragraph.firstChild) {
                paragraph.insertBefore(approval, paragraph.firstChild);
            } else {
                paragraph.appendChild(approval);
            }
        } else if (paragraph.innerHTML.indexOf('-1 Deny') !== -1) {
            paragraph.innerHTML = paragraph.innerHTML.replace('-1 Deny', '');

            var denial = document.createElement('div');
            denial.className = 'state state-closed js-comment-denied';
            denial.style.width = '100%';
            denial.appendChild(document.createTextNode('Denied'));

            if (paragraph.firstChild) {
                paragraph.insertBefore(denial, paragraph.firstChild);
            } else {
                paragraph.appendChild(denial);
            }
        }
    }

    var newCommentForm = document.getElementsByClassName('js-new-comment-form');
    if (!newCommentForm || newCommentForm.length === 0) {
        return;
    }

    newCommentForm = newCommentForm[0];

    var commentBody = newCommentForm.getElementsByClassName('js-comment-field');
    if (!commentBody || commentBody.length === 0) {
        return;
    }

    commentBody = commentBody[0];

    var formActions = newCommentForm.getElementsByClassName('form-actions');
    if (!formActions || formActions.length === 0) {
        return;
    }

    formActions = formActions[0];

    var approveButton = document.createElement('button');
    approveButton.className = 'btn btn-primary js-approve-button';
    approveButton.style.marginRight = '5px';
    approveButton.tabIndex = 5;
    approveButton.onclick = function(e) {
        commentBody.value = '+1 Approve ' + commentBody.value;
        newCommentForm.submit();

        return false;
    };

    approveButton.appendChild(document.createTextNode('Approve'));

    var denyButton = document.createElement('button');
    denyButton.className = 'btn js-deny-button';
    denyButton.tabIndex = 4;
    denyButton.onclick = function(e) {
        commentBody.value = '-1 Deny ' + commentBody.value;
        newCommentForm.submit();

        return false;
    };

    denyButton.appendChild(document.createTextNode('Deny'));

    var closeButton = formActions.children[1];

    formActions.insertBefore(approveButton, closeButton);
    formActions.insertBefore(document.createTextNode(' '), closeButton);
    formActions.insertBefore(denyButton, closeButton);
    formActions.insertBefore(document.createTextNode(' '), closeButton);
})();
