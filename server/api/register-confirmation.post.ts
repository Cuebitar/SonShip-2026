type RegistrationPayload = {
  locale?: string
  registration?: {
    name?: string
    email?: string
    ic?: string
    phone?: string
    gender?: string
    transport?: string
    important_info?: string
    emergency?: {
      name?: string
      phone?: string
      relationship?: string
    }
    questions?: {
      place?: string
      pain?: string
      verse?: string
    }
  }
}

const copyByLocale = {
  en: {
    subject: 'SonShip Camp Registration Confirmation',
    heading: 'Your registration has been received',
    intro: 'Thanks for registering for SonShip Camp. Here is a summary of the details you submitted.',
    outro: 'Please keep this email for reference. If anything needs to be updated, reply to this email or contact the organizing team.',
    sections: {
      personal: 'Personal Details',
      emergency: 'Emergency Contact',
      questions: 'Additional Questions',
    },
    labels: {
      name: 'Full Name',
      email: 'Email',
      ic: 'IC Number',
      phone: 'Phone Number',
      gender: 'Gender',
      transport: 'Transportation',
      importantInfo: 'Important Information',
      emergencyName: 'Emergency Contact Name',
      emergencyPhone: 'Emergency Contact Phone',
      emergencyRelationship: 'Relationship',
      q1: 'Favorite Bible story',
      q2: 'Love language',
      q3: 'Free time activity',
      notProvided: 'Not provided',
    },
    values: {
      male: 'Male',
      female: 'Female',
      bus: 'By Bus',
      car: 'By Car',
      father: 'Father',
      mother: 'Mother',
      guardian: 'Guardian',
      sibling: 'Sibling',
      partner: 'Partner',
    },
  },
  zh: {
    subject: 'SonShip 营会报名确认',
    heading: '我们已收到您的报名',
    intro: '感谢您报名 SonShip 营会。以下是您提交的资料摘要，方便您留底参考。',
    outro: '请保留此邮件作为记录。如需更新资料，可直接回复此邮件或联系筹委团队。',
    sections: {
      personal: '个人资料',
      emergency: '紧急联系人',
      questions: '附加问题',
    },
    labels: {
      name: '全名',
      email: '电子邮件',
      ic: '身份证号码',
      phone: '电话号码',
      gender: '性别',
      transport: '交通方式',
      importantInfo: '重要信息',
      emergencyName: '紧急联系人姓名',
      emergencyPhone: '紧急联系人电话',
      emergencyRelationship: '关系',
      q1: '最喜欢的圣经故事',
      q2: 'Love Language',
      q3: '空闲时会做的事',
      notProvided: '未填写',
    },
    values: {
      male: '男',
      female: '女',
      bus: '搭巴士',
      car: '开车',
      father: '父亲',
      mother: '母亲',
      guardian: '监护人',
      sibling: '兄弟姐妹',
      partner: '伴侣',
    },
  },
} as const

type CopyByLocale = (typeof copyByLocale)[keyof typeof copyByLocale]

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatValue(value: string | undefined, fallback: string) {
  if (!value) return fallback
  return value
}

function maskIc(ic: string | undefined, fallback: string) {
  if (!ic) return fallback
  const digits = ic.replace(/\D/g, '')
  if (digits.length < 4) return fallback
  return `******-**-${digits.slice(-4)}`
}

function translateOption(copy: CopyByLocale, value: string | undefined) {
  if (!value) return copy.labels.notProvided
  return copy.values[value as keyof typeof copy.values] ?? value
}

function buildRows(rows: Array<{ label: string; value: string }>) {
  return rows
    .map(({ label, value }) => `
      <tr>
        <td style="padding:10px 0;color:#bca889;font-size:13px;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
        <td style="padding:10px 0;color:#f6e9d7;font-size:14px;line-height:1.5;">${escapeHtml(value)}</td>
      </tr>
    `)
    .join('')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody<RegistrationPayload>(event)
  const registration = body.registration

  if (!registration?.email || !registration?.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Registration name and email are required.',
    })
  }

  if (!config.resendApiKey || !config.registrationEmailFrom) {
    return {
      sent: false,
      skipped: true,
      reason: 'email_not_configured',
    }
  }

  const copy = copyByLocale[body.locale === 'zh' ? 'zh' : 'en']
  const fallback = copy.labels.notProvided

  const personalRows = buildRows([
    { label: copy.labels.name, value: formatValue(registration.name, fallback) },
    { label: copy.labels.email, value: formatValue(registration.email, fallback) },
    { label: copy.labels.ic, value: maskIc(registration.ic, fallback) },
    { label: copy.labels.phone, value: formatValue(registration.phone, fallback) },
    { label: copy.labels.gender, value: translateOption(copy, registration.gender) },
    { label: copy.labels.transport, value: translateOption(copy, registration.transport) },
    { label: copy.labels.importantInfo, value: formatValue(registration.important_info, fallback) },
  ])

  const emergencyRows = buildRows([
    { label: copy.labels.emergencyName, value: formatValue(registration.emergency?.name, fallback) },
    { label: copy.labels.emergencyPhone, value: formatValue(registration.emergency?.phone, fallback) },
    { label: copy.labels.emergencyRelationship, value: translateOption(copy, registration.emergency?.relationship) },
  ])

  const questionRows = buildRows([
    { label: copy.labels.q1, value: formatValue(registration.questions?.place, fallback) },
    { label: copy.labels.q2, value: formatValue(registration.questions?.pain, fallback) },
    { label: copy.labels.q3, value: formatValue(registration.questions?.verse, fallback) },
  ])

  const html = `
    <div style="background:#171717;padding:32px 16px;font-family:Arial,sans-serif;">
      <div style="max-width:680px;margin:0 auto;background:rgba(58,38,32,0.88);border:1px solid rgba(230,177,83,0.22);border-radius:24px;overflow:hidden;">
        <div style="padding:32px;background:radial-gradient(circle at top, rgba(230,177,83,0.18), transparent 58%);">
          <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(230,177,83,0.12);border:1px solid rgba(230,177,83,0.2);color:#e6b153;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
            SonShip Camp
          </div>
          <h1 style="margin:20px 0 10px;color:#e6b153;font-size:28px;line-height:1.2;">${escapeHtml(copy.heading)}</h1>
          <p style="margin:0;color:#f6e9d7;font-size:15px;line-height:1.7;">${escapeHtml(copy.intro)}</p>
        </div>
        <div style="padding:0 32px 32px;">
          <section style="padding:22px 0;border-top:1px solid rgba(230,177,83,0.14);">
            <h2 style="margin:0 0 12px;color:#e6b153;font-size:18px;">${escapeHtml(copy.sections.personal)}</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${personalRows}</table>
          </section>
          <section style="padding:22px 0;border-top:1px solid rgba(230,177,83,0.14);">
            <h2 style="margin:0 0 12px;color:#e6b153;font-size:18px;">${escapeHtml(copy.sections.emergency)}</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${emergencyRows}</table>
          </section>
          <section style="padding:22px 0;border-top:1px solid rgba(230,177,83,0.14);">
            <h2 style="margin:0 0 12px;color:#e6b153;font-size:18px;">${escapeHtml(copy.sections.questions)}</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${questionRows}</table>
          </section>
          <p style="margin:0;padding-top:10px;color:#bca889;font-size:13px;line-height:1.7;">${escapeHtml(copy.outro)}</p>
        </div>
      </div>
    </div>
  `

  const text = [
    copy.heading,
    '',
    copy.intro,
    '',
    `${copy.sections.personal}`,
    `- ${copy.labels.name}: ${formatValue(registration.name, fallback)}`,
    `- ${copy.labels.email}: ${formatValue(registration.email, fallback)}`,
    `- ${copy.labels.ic}: ${maskIc(registration.ic, fallback)}`,
    `- ${copy.labels.phone}: ${formatValue(registration.phone, fallback)}`,
    `- ${copy.labels.gender}: ${translateOption(copy, registration.gender)}`,
    `- ${copy.labels.transport}: ${translateOption(copy, registration.transport)}`,
    `- ${copy.labels.importantInfo}: ${formatValue(registration.important_info, fallback)}`,
    '',
    `${copy.sections.emergency}`,
    `- ${copy.labels.emergencyName}: ${formatValue(registration.emergency?.name, fallback)}`,
    `- ${copy.labels.emergencyPhone}: ${formatValue(registration.emergency?.phone, fallback)}`,
    `- ${copy.labels.emergencyRelationship}: ${translateOption(copy, registration.emergency?.relationship)}`,
    '',
    `${copy.sections.questions}`,
    `- ${copy.labels.q1}: ${formatValue(registration.questions?.place, fallback)}`,
    `- ${copy.labels.q2}: ${formatValue(registration.questions?.pain, fallback)}`,
    `- ${copy.labels.q3}: ${formatValue(registration.questions?.verse, fallback)}`,
    '',
    copy.outro,
  ].join('\n')

  try {
    const response = await $fetch<{ id?: string }>('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
      },
      body: {
        from: config.registrationEmailFrom,
        to: [registration.email],
        reply_to: config.registrationEmailReplyTo || undefined,
        subject: copy.subject,
        html,
        text,
      },
    })

    return {
      sent: true,
      id: response?.id ?? null,
    }
  } catch (error) {
    console.error(error)
    return {
      sent: false,
      skipped: false,
      reason: 'email_send_failed',
    }
  }
})
