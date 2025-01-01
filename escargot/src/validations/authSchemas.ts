import * as Yup from 'yup';
import { PAYMENT_METHODS } from '@/lib/constants/index';



// UTILISATEUR
export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string().required('Mot de passe requis'),
});

export const registrationSchema = Yup.object().shape({
  firstName: Yup.string().required('Prénom requis').max(65, 'Le prénom ne doit pas dépasser 65 caractères'),
  lastName: Yup.string().required('Nom requis').max(65, 'Le nom ne doit pas dépasser 65 caractères'),
  address: Yup.string().required('Adresse requise').max(180, 'L\'adresse ne doit pas dépasser 180 caractères'),
  city: Yup.string().required('Ville requise').max(65, 'La ville ne doit pas dépasser 65 caractères'),
  postalCode: Yup.string().required('Code postal requis').max(20, 'Le code postal ne doit pas dépasser 20 caractères'),
  country: Yup.string().required('Pays requis').max(65, 'Le pays ne doit pas dépasser 65 caractères'),
  phone: Yup.string().required('Téléphone requis').max(30, 'Le numéro de téléphone ne doit pas dépasser 30 caractères'),
  email: Yup.string().email('Email invalide').required('Email requis').max(255, 'L\'email ne doit pas dépasser 255 caractères'),
  password: Yup.string().required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre')
    .required('Confirmation du mot de passe requise'),
    gdprConsent: Yup.boolean().required('Vous devez accepter les conditions RGPD'),
  });
  
export const updateProfileSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  address: Yup.string().required(),
  city: Yup.string().required(),
  postalCode: Yup.string().required(),
  country: Yup.string().required(),
  phone: Yup.string().required(),
  profileImagePath: Yup.string().nullable(),
});

export const updateUserSchema = updateProfileSchema.shape({
  id: Yup.number().required('Id requis'),
  roleId: Yup.number().required('Rôle requis'),
  isActive: Yup.boolean(),
});

// PRODUIT
export const productInsertionSchema = Yup.object().shape({
  name: Yup.string().required('Nom requis').max(255, 'Le nom ne doit pas dépasser 255 caractères'),
  description: Yup.string().required('Description requise'),
  price: Yup.number().required('Prix requis').positive('Le prix doit être positif'),
  imagePath: Yup.string().required('Image requise').max(255, 'Le chemin de l\'image ne doit pas dépasser 255 caractères'),
  categoryId: Yup.number().required('Catégorie requise'),
});

export const productUpdateSchema = productInsertionSchema.shape({
  id: Yup.number().required('Id requis'),
});

export const reviewInsertionSchema = Yup.object().shape({
  content: Yup.string().required('Commentaire requis'),
  rating: Yup.number().integer().min(1, 'La note doit être au moins 1').max(5, 'La note peut être au plus de 5'),
  userId: Yup.number().required('Id utilisateur requis'),
  productId: Yup.number().required('Id produit requis'),
});

// PANIER
export const cartItemSchema = Yup.object().shape({
  quantity: Yup.number().integer().min(1, 'La quantité doit être au moins de 1'),
  productId: Yup.number().required('Id produit requis'),
});

// COMMANDE
export const orderInsertionSchema = Yup.object().shape({
  userId: Yup.number().required('Id utilisateur requis'),
  taxPrice: Yup.number().required('Prix des taxes requis'),
  totalAmount: Yup.number().required('Montant total requis'),
  status: Yup.string()
    .required('Statut requis')
    .max(50, 'Le statut ne doit pas dépasser de 50 caractères'),
    shippingAddress:Yup.object()
    .nullable()
    .required("Adresse de livraison requise"),
    paymentMethod:Yup.string()
    .nullable()
    .required("Méthode de paiement requise"),
    itemsPrice:Yup.number()
    .nullable()
    .positive("Prix des articles requis"),
    shippingPrice:Yup.number()
    .nullable()
    .positive("Prix de livraison requis"),
});

export const orderItemInsertionSchema = Yup.object().shape({
    orderId:Yup.number()
    .nullable()
    .required("ID commande est requise"),
    productId:Yup.number()
    .nullable()
    .required("ID produit est requise"),
    quantity:Yup.number()
    .integer()
    .min(1,"La quantité doit être au moins de un"),
});

// PAIEMENT
export const paymentInsertionSchema = Yup.object().shape({
    orderId:Yup.number()
    .nullable()
    .required("ID commande est requise"),
    amount:Yup.number()
    .nullable()
    .positive("Montant est requise")
    .required("Montant est requise"),
    status:Yup.string()
    .nullable()
    .max(50,"Statut ne devrait pas depasser cinquante")
    .required("Statut est requise"),
});

export const paymentMethodSchema = Yup.object().shape({
  type: Yup.string()
    .required('Méthode de paiement requise')
    .test('is-valid-method', 'Méthode de paiement invalide', (value) => 
      PAYMENT_METHODS.includes(value)
    ),
});

export const paymentResultSchema = Yup.object().shape({
  id: Yup.string().required('ID requis'),
  status: Yup.string().required('Statut requis'),
  email_address: Yup.string().email('Adresse email invalide').required('Adresse email requise'),
  pricePaid: Yup.string().required('Prix payé requis'),
});

export const insertReviewSchema = Yup.object().shape({
  title: Yup.string()
    .required('Le titre est requis'),
  description: Yup.string()
    .required('La description est requise'),
  rating: Yup.number()
    .required('La note est requise')
    .min(1, 'La note doit être au moins 1')
    .max(5, 'La note doit être au plus 5'),
  userId: Yup.string().required(),
  productId: Yup.string().required(),
});