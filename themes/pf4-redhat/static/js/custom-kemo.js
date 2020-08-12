if (typeof Cookies2 !== 'function') {
  var Cookies2 = Cookies.noConflict();
}

if (typeof cleanArray !== 'function') {
  function cleanArray(actual) {
    const newArray = new Array();
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }
}
// Gravatar Processing
function getGravatarLink(email, size = 70) {
  const md5Email = md5(email.toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${md5Email}?s=${size}`;
}
function setGravatar(link) {
  if (link) {
    return jQuery('.pf-c-avatar').attr('src', link);
  }
  return jQuery('.pf-c-avatar').attr('src', '/img/img_avatar.svg');
}
function processGravatar(email) {
  if (email) {
    return setGravatar(getGravatarLink(email));
  }

  return setGravatar();
}

// User Name Processing

function setUserName(name = 'Student User') {
  return jQuery('.userNameData').text(name);
}

function showLoadingScreen(spinner = true) {
  jQuery('#loadingScreen').removeClass('pf-u-display-none');
  if (spinner) {
    jQuery('#loadingScreen .pf-c-spinner').removeClass('pf-u-display-none');
  }
}
function hideLoadingScreen() {
  setTimeout(function() {
    jQuery('#loadingScreen').addClass('pf-u-display-none');
  }, 250);
}

function templateBakedCookies() {
  // Template out other Cookies...
  // console.log('templating cookies...');
  const bakedCookies = JSON.parse(Cookies2.get('bakedCookies', { path: '/' }));
  for (const key of Object.keys(bakedCookies)) {
    const cookieValStr = String(bakedCookies[key].cookie_value);
    if (cookieValStr.startsWith('[[') && cookieValStr.endsWith(']]')) {
      const findKey = bakedCookies[key].cookie_value.slice(2, -2);
      const newCookieVal = Cookies2.get(findKey, {
        path: Cookies2.get('active_workshop_path', { path: '/' }),
      });
      /*
      console.log(
        `found templated cookie ${
          bakedCookies[key].cookie_key
        }: ${findKey} with value ${newCookieVal} at path ${Cookies2.get(
          'active_workshop_path',
          { path: '/' }
        )}`
      );
      console.log(
        `resetting cookie: ${bakedCookies[key].cookie_key} - ${newCookieVal}`
      );
      */
      Cookies2.set(bakedCookies[key].cookie_key, newCookieVal, {
        expires: parseInt(bakedCookies[key].cookie_expiration),
        path: bakedCookies[key].cookie_path,
        // domain: bakedCookies[key].cookie_domain,
      });
    }
  }
  if (typeof pageLoadWorkshopFooterTest === 'function') {
    pageLoadWorkshopFooterTest();
  }
}

function readCookiesAndSetVisual() {
  if (Cookies2.get('student_email')) {
    processGravatar(Cookies2.get('student_email'));
  }
  if (Cookies2.get('student_name')) {
    setUserName(Cookies2.get('student_name'));
  }
  if (Cookies2.get('student_id')) {
    jQuery('#logoutBtn, #eventIDModalBtn').removeClass('pf-u-hidden');
    jQuery('#loginBtn').addClass('pf-u-hidden');
  }
  if (Cookies2.get('active_workshop_path', { path: '/' })) {
    templateBakedCookies();
    const wPath = cleanArray(window.location.pathname.split('/'));
    const basePath = `/${wPath[0]}/${wPath[1]}/`;
    if (Cookies2.get('active_workshop_path', { path: '/' }) === basePath) {
      jQuery('#workshopFooterDetails')
        .next()
        .addClass('pf-u-hidden');
    }
    jQuery('#eventIDModalBtn').addClass('pf-u-hidden');
    jQuery('#gotoWorkshopBtn').removeClass('pf-u-hidden');
  }
}
function navigateToActiveWorkshop() {
  window.location.href = Cookies2.get('active_workshop_path', { path: '/' });
}
function resetVisuals() {
  setUserName();
  processGravatar();
  jQuery('#logoutBtn, #eventIDModalBtn, #gotoWorkshopBtn').addClass(
    'pf-u-hidden'
  );
  jQuery('#loginBtn').removeClass('pf-u-hidden');
  if (typeof setWorkshopFooterData === 'function') {
    setWorkshopFooterData();
  }
}
function logStudentOut() {
  Cookies2.remove('student_email');
  Cookies2.remove('student_name');
  Cookies2.remove('student_name_id');
  Cookies2.remove('student_id');
  const workshop_path = Cookies2.get('active_workshop_path', { path: '/' });
  console.log(`found workshop_path: ${workshop_path}`);
  Cookies2.remove('seat_number', { path: workshop_path });
  Cookies2.remove('userid', { path: workshop_path });
  Cookies2.remove('domain', { path: workshop_path });
  Cookies2.remove('prefix', { path: workshop_path });
  Cookies2.remove('seat_number', { path: workshop_path });
  Cookies2.remove('userid', { path: '/' });
  Cookies2.remove('domain', { path: '/' });
  Cookies2.remove('prefix', { path: '/' });
  Cookies2.remove('seat_number');
  Cookies2.remove('userid');
  Cookies2.remove('domain');
  Cookies2.remove('prefix');
  Cookies2.remove('active_workshop_path');
  Cookies2.remove('active_workshop_path', { path: '/' });
  Cookies2.remove('active_workshop_path', { path: workshop_path });
  Cookies2.remove('bakedCookies');
  Cookies2.remove('bakedCookies', { path: '/' });
  resetVisuals();
  if (typeof resetWorkshopFooter === 'function') {
    resetWorkshopFooter();
  }
}

jQuery(document).ready(function() {
  readCookiesAndSetVisual();
  jQuery('.mainWorkshopListing .pf-l-grid__item').click(function(event) {
    window.location.href = jQuery('a.view-workshop-url', this).attr('href');
  });

  jQuery(function() {
    // matchHeight the contents of each .card-pf and then the .card-pf itself
    jQuery(
      '.mainWorkshopListing .pf-l-grid__item > .pf-c-card .card-pf-title'
    ).matchHeight();
    jQuery(
      '.mainWorkshopListing .pf-l-grid__item > .pf-c-card > .card-pf-body'
    ).matchHeight();
    jQuery(
      '.mainWorkshopListing .pf-l-grid__item > .pf-c-card > .card-pf-footer'
    ).matchHeight();
    jQuery('.mainWorkshopListing .pf-l-grid__item > .pf-c-card').matchHeight();
  });

  jQuery(document)
    .on('hide.bs.modal', function() {
      hideLoadingScreen();
    })
    .on('show.bs.modal', function() {
      showLoadingScreen(false);
    });
  jQuery(document).on('click', '.pf-c-modal-box>.pf-c-button', function(e) {
    jQuery(this)
      .parent()
      .modal('hide');
  });

  $('.pf-c-page__sidebar-body').slimScroll({
    height: '100%',
    width: 'var(--pf-c-page__sidebar--Width)',
  });
});
