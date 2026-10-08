/**
 * Acme Proof • Standalone Social Proof Embeddable Widget
 * Conforming to MERN Spec & Standalone Embed Script
 * Works seamlessly on localhost:3000 and production deployments
 */
(function () {
  function initAcmeProofWidgets() {
    var containers = document.querySelectorAll('#acme-proof-widget, [data-acme-proof]');
    
    containers.forEach(function (container) {
      if (container.getAttribute('data-acme-initialized') === 'true') return;
      container.setAttribute('data-acme-initialized', 'true');

      var space = container.getAttribute('data-space') || 'acme-corp';
      var layout = container.getAttribute('data-layout') || 'grid';
      var theme = container.getAttribute('data-theme') || 'light';
      var origin = window.location.origin;

      // Find script tag to determine host if embedded remotely
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (src && src.indexOf('/embed.js') !== -1) {
          try {
            var url = new URL(src);
            origin = url.origin;
          } catch (e) {}
          break;
        }
      }

      // Fetch approved reviews from API
      fetch(origin + '/api/testimonials/wall/' + encodeURIComponent(space))
        .then(function (res) { return res.json(); })
        .then(function (data) {
          renderWidget(container, data.testimonials || [], {
            space: space,
            layout: layout,
            theme: theme,
            origin: origin
          });
        })
        .catch(function (err) {
          console.warn('[Acme Proof] Error loading testimonials:', err);
        });
    });
  }

  function renderWidget(container, testimonials, options) {
    var isDark = options.theme === 'dark';
    var bg = isDark ? '#0f172a' : '#ffffff';
    var textColor = isDark ? '#f8fafc' : '#0f172a';
    var subtextColor = isDark ? '#94a3b8' : '#64748b';
    var borderColor = isDark ? '#334155' : '#e2e8f0';
    var cardBg = isDark ? '#1e293b' : '#ffffff';

    var html = '<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; background:' + bg + '; color:' + textColor + '; padding: 20px; border-radius: 16px; border: 1px solid ' + borderColor + ';">';
    
    html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid ' + borderColor + '; padding-bottom:12px;">';
    html += '<div><strong style="font-size:14px; text-transform:uppercase; letter-spacing:0.05em; color:' + textColor + '">Verified Customer Reviews</strong></div>';
    html += '<div style="font-size:11px; color:' + subtextColor + '">Powered by <strong>Acme Proof</strong></div>';
    html += '</div>';

    if (testimonials.length === 0) {
      html += '<p style="font-size:13px; color:' + subtextColor + '; text-align:center; padding: 24px 0;">No reviews to display yet.</p>';
    } else {
      var gridStyle = options.layout === 'badge' 
        ? 'display:flex; flex-direction:column; gap:12px;'
        : 'display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:16px;';
      
      html += '<div style="' + gridStyle + '">';

      testimonials.forEach(function (t) {
        var stars = '★'.repeat(t.rating) + '☆'.repeat(Math.max(0, 5 - t.rating));
        var avatar = t.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(t.clientName);

        html += '<div style="background:' + cardBg + '; border:1px solid ' + borderColor + '; border-radius:12px; padding:16px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">';
        html += '<div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">';
        html += '<img src="' + avatar + '" alt="' + t.clientName + '" style="width:38px; height:38px; border-radius:50%; object-fit:cover;" />';
        html += '<div>';
        html += '<div style="font-weight:700; font-size:13px; color:' + textColor + ';">' + t.clientName + '</div>';
        html += '<div style="font-size:11px; color:' + subtextColor + ';">' + (t.companyRole || '') + (t.companyName ? ' at ' + t.companyName : '') + '</div>';
        html += '</div></div>';
        html += '<div style="color:#f59e0b; font-size:14px; margin-bottom:8px;">' + stars + '</div>';
        html += '<p style="font-size:12.5px; line-height:1.5; color:' + textColor + '; margin:0;">"' + t.reviewText + '"</p>';
        html += '</div>';
      });

      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAcmeProofWidgets);
  } else {
    initAcmeProofWidgets();
  }
})();
