import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { fadeInUp } from '../../styles/animations';
import { Button } from '../common/Button';
import { FaPaperPlane } from 'react-icons/fa';

const FormContainer = styled(motion.form)`
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled(motion.div)`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.silver};
  margin-bottom: ${theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.neutral.white};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.md};
  transition: all ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.neutral.lightGray};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${theme.colors.primary.glow};
  }

  &:hover:not(:focus) {
    border-color: ${theme.colors.primary.dark};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.neutral.white};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.md};
  resize: vertical;
  transition: all ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.neutral.lightGray};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${theme.colors.primary.glow};
  }

  &:hover:not(:focus) {
    border-color: ${theme.colors.primary.dark};
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing.md};
`;

const StatusMessage = styled(motion.div)<{ type: 'success' | 'error' }>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing.md};
  text-align: center;
  font-size: ${theme.typography.sizes.sm};
  background: ${props => props.type === 'success'
    ? `${theme.colors.accent.green}20`
    : `${theme.colors.accent.red}20`};
  color: ${props => props.type === 'success'
    ? theme.colors.accent.green
    : theme.colors.accent.red};
  border: 1px solid ${props => props.type === 'success'
    ? theme.colors.accent.green
    : theme.colors.accent.red};
`;

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation('contact');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus({
        type: 'success',
        message: t('form.success'),
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({
        type: 'error',
        message: t('form.error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer
      onSubmit={handleSubmit}
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <FormGroup
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="name">{t('form.name')}</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('form.namePlaceholder')}
          required
        />
      </FormGroup>

      <FormGroup
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <Label htmlFor="email">{t('form.email')}</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('form.emailPlaceholder')}
          required
        />
      </FormGroup>

      <FormGroup
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="subject">{t('form.subject')}</Label>
        <Input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t('form.subjectPlaceholder')}
          required
        />
      </FormGroup>

      <FormGroup
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <Label htmlFor="message">{t('form.message')}</Label>
        <TextArea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t('form.messagePlaceholder')}
          required
        />
      </FormGroup>

      <SubmitButton
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          t('form.submit')
        ) : (
          <>
            {t('form.submit')} <FaPaperPlane />
          </>
        )}
      </SubmitButton>

      {status && (
        <StatusMessage
          type={status.type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {status.message}
        </StatusMessage>
      )}
    </FormContainer>
  );
};

export default ContactForm;
