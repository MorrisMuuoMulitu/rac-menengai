# Certificate verification

## Identifier

Every completed academy certificate receives a permanent identifier in the
form:

```text
RACMNG-2026-2027-ABCD-EFGH-JK
```

- `RACMNG` identifies the Rotaract Club of Menengai.
- `2026-2027` is the Rotary year, which runs from July through June.
- The final ten-character code is generated from cryptographically secure
  random bytes. It is not sequential and cannot be derived from a learner ID.

The identifier is stored in the learner's academy record. Reopening,
renaming, adding a photo or re-downloading the certificate does not change it.
Certificates issued before verification was introduced receive an identifier
when they are next opened or downloaded.

## QR code and public verification

The certificate QR code opens:

```text
https://rotaractmenengai.org/verify?number=<certificate-number>
```

The public verification endpoint checks that the number exists on a passed
learner record for the Menengai club. A successful check displays only:

- certificate holder name
- certificate number
- course title
- completion date
- Rotary year
- issuing club and signing officer

Email addresses, assessment answers, learner photos, private notes and
application details are not returned. Verification confirms that the club
issued the certificate; it does not establish Rotaract membership or a Rotary
qualification.
