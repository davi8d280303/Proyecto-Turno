const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SCHEMA = process.env.SUPABASE_SCHEMA || 'public';

const hasServiceCredentials = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const hasAnonCredentials = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function buildQuery(endpoint, { select = '*', limit, filters = {}, order } = {}) {
  endpoint.searchParams.set('select', select);

  if (typeof limit === 'number') {
    endpoint.searchParams.set('limit', String(limit));
  }

  // ✅ FIX: soporte para order
  if (order) {
    endpoint.searchParams.set('order', order);
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      endpoint.searchParams.set(key, value);
    }
  });
}

function buildClient(key) {
  async function request(table, {
    method = 'GET',
    select,
    limit,
    filters,
    order,
    body,
    signal,
    prefer,
  } = {}) {
    const endpoint = new URL(`${SUPABASE_URL}/rest/v1/${table}`);

    if (method === 'GET' || method === 'PATCH' || method === 'DELETE') {
      buildQuery(endpoint, { select, limit, filters, order });
    }

    const response = await fetch(endpoint.toString(), {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(payload?.message || payload?.error || `Supabase error ${response.status}`);
      error.statusCode = response.status;
      error.details = payload;
      throw error;
    }

    return payload;
  }

  return {
    url: SUPABASE_URL,
    schema: SUPABASE_SCHEMA,
    restSelect(table, options = {}) {
      return request(table, {
        method: 'GET',
        ...options,
        prefer: options.prefer || 'count=exact',
      });
    },
    restInsert(table, rows, options = {}) {
      return request(table, {
        method: 'POST',
        body: rows,
        prefer: options.prefer || 'return=representation',
      });
    },
    restUpdate(table, body, options = {}) {
      return request(table, {
        method: 'PATCH',
        body,
        select: options.select || '*',
        filters: options.filters,
        order: options.order,
        prefer: options.prefer || 'return=representation',
      });
    },
    restDelete(table, options = {}) {
      return request(table, {
        method: 'DELETE',
        select: options.select || '*',
        filters: options.filters,
        order: options.order,
        prefer: options.prefer || 'return=representation',
      });
    },
  };
}

function getSupabaseAdmin() {
  if (!hasServiceCredentials) {
    const error = new Error('Supabase admin client no configurado.');
    error.statusCode = 500;
    throw error;
  }
  return buildClient(SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabasePublic() {
  if (!hasAnonCredentials) {
    const error = new Error('Supabase public client no configurado.');
    error.statusCode = 500;
    throw error;
  }
  return buildClient(SUPABASE_ANON_KEY);
}

module.exports = {
  getSupabaseAdmin,
  getSupabasePublic,
};