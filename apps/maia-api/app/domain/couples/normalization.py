def normalize_partner_ids(
    partner_a_user_id: str,
    partner_b_user_id: str,
) -> tuple[str, str]:
    partner_a = partner_a_user_id.strip()
    partner_b = partner_b_user_id.strip()

    if not partner_a or not partner_b:
        raise ValueError("Partner user ids cannot be empty.")

    if partner_a == partner_b:
        raise ValueError("A couple requires two distinct Trevvos users.")

    if partner_a < partner_b:
        return partner_a, partner_b

    return partner_b, partner_a
