// ==UserScript==
// @name GitHub Approve/Deny
// @namespace http://github.com/cisox/github-approve-deny
// @description Adds Approve and Deny buttons to GitHub pull requests and parses pull request comments for Approve/Deny text.
// @include https://github.com/*/*/pull/*
// ==/UserScript==

(function() {
    var comments = document.getElementsByClassName('js-comment-body');
    for (var idx = 0; idx < comments.length; idx++) {
        var paragraph = comments[idx].children[0];
        if (!paragraph) {
            continue;
        }

        if (paragraph.innerHTML.indexOf('+1') != -1
            || paragraph.innerHTML.indexOf('Approve') != -1) {
            paragraph.innerHTML = '';
            
            var approval = document.createElement('div');
            approval.className = 'state-indicator open js-comment-approved';
            approval.appendChild(document.createTextNode('Approved'));

            paragraph.appendChild(approval);
        } else if (paragraph.innerHTML.indexOf('-1') != -1
            || paragraph.innerHTML.indexOf('Disapprove') != -1
            || paragraph.innerHTML.indexOf('Deny') != -1
            || paragraph.innerHTML.indexOf('Denied') != -1) {
            paragraph.innerHTML = '';
            
            var denial = document.createElement('div');
            denial.className = 'state-indicator closed js-comment-denied';
            denial.appendChild(document.createTextNode('Denied'));

            paragraph.appendChild(denial);
        }
    }

    var newCommentForm = document.getElementsByClassName('js-new-comment-form');
    if (!newCommentForm || newCommentForm.length == 0) {
        return;
    }

    newCommentForm = newCommentForm[0];

    var commentBody = newCommentForm.getElementsByClassName('js-comment-field');
    if (!commentBody || commentBody.length == 0) {
        return;
    }

    commentBody = commentBody[0];

    var formActions = newCommentForm.getElementsByClassName('form-actions');
    if (!formActions || formActions.length == 0) {
        return;
    }

    formActions = formActions[0];

    var approveButton = document.createElement('button');
    approveButton.className = 'button primary js-approve-button';
    approveButton.tabIndex = 4;
    approveButton.onclick = function(e) {
        commentBody.value = '+1 Approve';
        newCommentForm.submit();

        return false;
    };

    approveButton.appendChild(document.createTextNode('Approve'));

    var denyButton = document.createElement('button');
    denyButton.className = 'button danger js-deny-button';
    denyButton.tabIndex = 5;
    denyButton.onclick = function(e) {
        commentBody.value = '-1 Deny';
        newCommentForm.submit();

        return false;
    };

    denyButton.appendChild(document.createTextNode('Deny'));

    var closeButton = formActions.children[1];

    formActions.insertBefore(denyButton, closeButton);
    formActions.insertBefore(document.createTextNode(' '), closeButton);
    formActions.insertBefore(approveButton, closeButton);
    formActions.insertBefore(document.createTextNode(' '), closeButton);
})();
