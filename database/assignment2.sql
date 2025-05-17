-- query 1
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- query 2
UPDATE public.account
set account_type = 'Admin'
WHERE account_id = 1;
-- query 3
DELETE FROM public.account
WHERE account_id = 1;
-- query 4
UPDATE public.inventory
SET inv_description = Replace(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- query 5
SELECT inv_make as make,
    inv_model as model,
    classification_name as "classification name"
FROM public.inventory
    INNER JOIN public.classification ON inventory.classification_id = classification.classification_id;
-- query 6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles');