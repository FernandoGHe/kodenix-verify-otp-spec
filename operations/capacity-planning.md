# Capacity Planning

Regla práctica:

1 OTP enviado = 1 usage event + 1 challenge + 1-3 audit events + provider call.

Con fallback:

1 operación puede generar 2 o 3 OTP enviados facturables.

Dimensionar DB y logs considerando multiplicador de fallback del 5-20% inicialmente.
