/** VIEW TRANSITIONS **/

$(document).on("click", "#pjk-action-pl", function(){
    transition_to_plist();
});

$(document).on("click", "#pjk-action-cp", function(){
    //$('#pname').val(pjk.nextGenericName());
    $('#pname').val('');
    transition_view($('#view-create-project'));
    set_tab_live('pjk-action-cp');
});

$(document).on('click', ".pjk-action-edit", function(){
    var id = $(this).parent().attr('rel');
    pjk.setActiveProjink(id);
    buildEditView(id);
    transition_view($('#view-project-edit'));
});

var transition_view = function(ele){
    $('.views').hide();
    ele.show();
}
var transition_to_plist = function(){
    if( pjk.collection_count() < 1){
        $('#pjk-action-cp').trigger("click");
        return;
    }
    show_plist();
    transition_view($('#prolist'));
}


/** END VIEW TRANSITIONS **/


/** FORM CLICKS **/

$(document).on('click', "#button-save-projink", function(){
    saveProjinkEdit();
});

$(document).on("click", "#delete-projink",function() {
    pjk.removeCollection(pjk.active_project_id);
    pj_notify("projink removed");
    transition_to_plist();
});

$(document).on("click", "#btn-view-create-project", function(){
    create_projink();
});

/** END FORM  CLICKS **/




$(document).on("click", ".open-project span.ptitle, .open-project a.expander", function(){
    var ele = $(this).parent();
    pjk.setActiveProjink(ele.attr('rel'));
    toggle_projink(ele);
});


/* double clicking list item should do something someday */
$(document).on("click", ".open-url-new-tab", function(){
    var ele = $(this);
    chrome.tabs.create({ url: ele.attr('rel') });
});
$(document).on("click", ".open-url", function(){
    var ele = $(this);
    //window.location.href = ele.attr('rel');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: ele.attr('rel')});
    });
});
$(document).on("click", ".copy-url", function(){
    var ele = $(this).parent().find('input');
    var live_url = $('#live-url');
    live_url.val(ele.val());
    live_url.focus();
    live_url.select();
    document.execCommand('Copy');
    pj_notify("link copied to clipboard");
});


$(document).on("click", ".remove-link", function(){
    var ele = $(this);
    pjk.removeLinkFromActive(ele.attr('rel'));
    removeElement(ele.parent());
    pj_notify("link removed");
});

$(document).on("click", ".add-url", function(){
    var ele = $(this).parent();
    var actID = $(this).parent().attr('rel');
    
    //set active project
    pjk.setActiveProjink(actID);

    pjk.addURL();

    var i = actID;
    var j = pjk.projinks[i].links.length - 1;

    links_holder = "";
    links_holder = append_pj_link(pjk,i,j);

    if (ele.find('ul.list-item-children').is(':visible')){} else{
        ele.find('ul.list-item-children').show();
    }
    ele.find('ul.list-item-children').append(links_holder);
    pj_notify("link added");
});

$(document).on("click", ".reset-projink", function(){
    pjk.clearActiveLinks();
    buildProjectView(pjk);
});



$(document).on("click", ".logo img", function(){
    projinks_website("/");
});


$(function () {
    $('#projinks-listing ul').sortable({
        //containment: 'parent', 
        tolerance: 'pointer', cursor: 'pointer',

        update: function( event, ui ) {
            save_sort();
        }

    });
});