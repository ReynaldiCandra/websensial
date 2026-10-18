# MASTER PROMPT FINAL — WEBSENSIAL
## PREMIUM 3D DIGITAL AGENCY + INTERACTIVE DEMO LAB + DIGITAL TEMPLATE MARKETPLACE

Act as a senior creative director, award-level UI/UX designer, creative frontend engineer, 3D web developer, motion designer, and production-focused software architect.

Your task is to significantly improve the existing Websensial project so its actual rendered appearance and user experience closely follow the supplied visual reference.

This is an existing project that has already been started. You must inspect and improve it, not rebuild it from scratch.

The current implementation has a white-and-purple visual identity, but its visual quality is still too generic. The reference has a much richer visual composition, premium 3D dashboard artwork, layered translucent interface panels, floating glass objects, soft volumetric lighting, high-quality project mockups, and a coherent full-page design.

The goal is not merely to create a functioning website. The goal is to create a visually distinctive, premium digital experience that makes visitors want to explore the portfolio, interact with the demos, and understand the value of Websensial's products and services.

---

# 1. NON-NEGOTIABLE PROJECT RULES

Before changing anything:

1. Inspect the existing codebase, framework, routes, components, package manager, dependencies, assets, and current implementation.
2. Inspect the supplied visual reference.
3. Preserve existing working code, business logic, useful assets, product data, bilingual support, and functionality.
4. Do not delete or replace the project unnecessarily.
5. Do not create a separate replacement application.
6. Do not make only superficial CSS adjustments and claim the visual redesign is complete.
7. Do not add unnecessary features before the core visual quality is corrected.
8. Do not fabricate customers, client projects, testimonials, business results, statistics, integrations, or completed functionality.
9. Do not claim that a feature, asset, integration, or test has been completed unless it has actually been implemented and verified.
10. Keep the existing business model: digital agency services plus a marketplace for ready-made digital templates. Do not turn Websensial into a SaaS website builder or customer-hosting platform.

If the reference image is not accessible in the development environment, ask for it to be saved at:

`public/reference/websensial-reference.png`

Do not pretend to have inspected an image that is unavailable.

Use the supplied reference as the primary visual target, not as loose inspiration.

# 2. BRAND IDENTITY AND DESIGN SYSTEM

Preserve the established Websensial brand direction.

Color palette:
- White: #FFFFFF
- Background: #F7F8FF
- Primary purple: #6328F5
- Hover purple: #4B18D6
- Secondary blue: #4F6BFF
- Accent lavender: #A58BFF
- Primary text: #171936
- Secondary text: #69708A
- Border: #E4E7F5
- Glass background: rgba(255,255,255,0.62)
- Glass border: rgba(255,255,255,0.85)
- Soft shadow: rgba(87,65,190,0.12)

Visual direction:
- Premium futuristic digital agency.
- Sophisticated white and lavender atmosphere.
- Realistic glassmorphism, not excessive transparent cards everywhere.
- Rich purple and periwinkle lighting.
- Elegant typography with strong hierarchy.
- Large, visually rich 3D compositions.
- Layered interface panels with convincing depth.
- Carefully controlled ambient shadows and highlights.
- Generous whitespace balanced with visual density.
- Smooth, intentional motion.
- Consistent visual language from the navigation through the footer.

Avoid:
- Generic AI-generated landing page aesthetics.
- Excessive pill-shaped cards and buttons.
- Repeated gradients used as a substitute for art direction.
- Random decorative blobs with no relationship to the content.
- Tiny hero illustrations.
- Low-quality or unrelated stock imagery.
- Empty sections with no useful purpose.
- Excessive blur that makes the interface look washed out.
- Inconsistent mockup styles.
- Fake statistics and fabricated social proof.

# 3. VISUAL REFERENCE MATCHING

Compare the current website with the reference in terms of:

- Overall composition.
- Hero proportions.
- Headline width and line breaks.
- Size and placement of the 3D artwork.
- Depth and overlap of floating interface panels.
- Dashboard complexity and legibility.
- Lighting, transparency, reflections, and shadows.
- Portfolio image quality.
- Section transitions.
- Content density.
- Typography scale.
- CTA hierarchy.
- Overall premium visual impression.

Create a visual discrepancy checklist before implementation.

Work through the largest discrepancies first. Do not waste time polishing small border details while the hero artwork remains incorrect.

The reference's large dashboard composition is a central visual feature, not an optional decoration.

# 4. INSTALL AND CONFIGURE THE REQUIRED VISUAL TECHNOLOGY

Inspect the existing framework and dependencies before installation.

Choose compatible tools based on actual requirements.

Consider:
- Three.js for real-time 3D rendering.
- @react-three/fiber if the existing application uses React and a React-based 3D renderer is appropriate.
- @react-three/drei for useful 3D helpers.
- Motion for React for interface transitions and motion, if an equivalent library is not already installed.
- An appropriate icon library consistent with the existing codebase.

Do not blindly install every library.

Use the project's existing package manager and preserve its lockfile.

Avoid duplicate animation frameworks and unnecessary heavy dependencies.

Verify framework compatibility, build configuration, server/client component boundaries, and browser support.

Important distinction: installing a 3D library does not provide the actual 3D models, textures, interface mockups, or reference artwork. You must create or acquire the required assets and integrate them.

# 5. ASSET ACQUISITION AND CREATION

Audit all existing image and media assets before creating replacements.

Create an asset inventory for:
- Hero desktop dashboard.
- Floating analytics panels.
- Smartphone mockup.
- Translucent glass cubes and spheres.
- Decorative 3D geometry.
- Background lighting effects.
- Six portfolio project mockups.
- Product and service preview images.

Choose the appropriate approach for each asset:

A. Reuse a suitable existing project asset.

B. Acquire an appropriate asset from a legitimate source with a license compatible with commercial use.

C. Create original 3D models, textures, SVG assets, interface compositions, or optimized imagery.

D. Build crisp interface mockups using HTML and CSS where this provides better quality and responsiveness than a flat image.

If external downloads are unavailable, create the best practical original alternative and report the limitation.

Never invent asset download success.

Never use unlicensed premium assets or random stock images as substitutes for the reference's distinctive visual composition.

Maintain an asset manifest documenting important external asset sources and license information.

Optimize all assets for production.

# 6. HOMEPAGE HERO — HIGHEST PRIORITY

Rebuild the existing hero composition within the current project.

## Left column

Include:
- A small, elegant category badge.
- A large headline with carefully controlled line breaks.
- Selective purple-to-blue text gradients.
- A concise, persuasive supporting paragraph.
- A prominent primary CTA.
- A secondary portfolio or demo CTA.
- Strong typography and appropriate spacing.

Keep the copy focused on the value Websensial provides to businesses.

## Right column: premium 3D dashboard scene

Build a visually rich composition inspired by the reference.

Required visual elements:

1. A large desktop analytics dashboard as the main background object.
2. A visible dashboard sidebar.
3. Multiple believable metric cards.
4. A bar chart and a line chart.
5. Product, customer, or performance cards.
6. Floating translucent interface panels at different depths.
7. A foreground smartphone displaying a coherent mobile interface.
8. Glass-like cubes, spheres, and selected geometric objects.
9. Soft lavender and purple lighting.
10. Layered shadows and convincing depth.
11. Carefully controlled overlap and perspective.
12. Smooth, restrained entrance and floating animations.

The hero artwork must be substantial and occupy a large part of the visible hero area.

Do not use a simplistic generic illustration as a substitute.

Prefer real HTML/CSS interface elements for readable dashboard content and genuine 3D rendering for objects that benefit from depth and perspective.

Use consistent interface data and visual hierarchy throughout the desktop dashboard and smartphone.

The composition should feel like one art-directed scene, not unrelated objects randomly placed beside each other.

If CSS-only implementation cannot achieve sufficient fidelity, use an appropriate combination of 3D rendering, original assets, and HTML interface layers.

# 7. MOTION DESIGN

Motion should reinforce depth and quality without compromising usability.

Implement where appropriate:
- Staggered entrance animations for hero text and buttons.
- Subtle floating movement for selected objects.
- Gentle depth or parallax effects.
- Smooth section transitions.
- Refined hover interactions for portfolio cards.
- Subtle lighting changes or rotation for 3D objects.
- Smooth navigation and CTA transitions.

Avoid:
- Excessive movement.
- Constant aggressive animations.
- Large particle systems without a clear purpose.
- Unnecessary cursor-following effects.
- Motion that makes text difficult to read.
- Animations that significantly delay the initial render.

Respect prefers-reduced-motion.

Provide a graceful static fallback if WebGL is unavailable.

# 8. FULL HOMEPAGE COMPOSITION

Improve the entire homepage, not just the hero.

Maintain a coherent visual flow across these sections:

1. Premium navigation.
2. Hero with 3D dashboard artwork.
3. Services or value propositions.
4. Interactive portfolio.
5. Capabilities or other truthful trust-building content.
6. Conversion-focused CTA.
7. Footer.

Use subtle background transitions, consistent spacing, and coordinated lighting.

Do not fill the page with unnecessary content merely to make it look long.

Do not display fabricated statistics such as 100+ completed projects, 98% client satisfaction, five years of experience, or 24/7 support unless those claims have been verified.

If verified numbers are unavailable, communicate capabilities and benefits without fabricated metrics.

# 9. PORTFOLIO — SIX DISTINCT VISUAL EXPERIENCES

Preserve the existing portfolio concept but significantly improve its visual quality.

Create six visually distinct project previews:

## Project 1 — Sora & Soul
Premium fashion e-commerce concept.
- Fashion-focused editorial imagery.
- Elegant typography.
- Premium storefront composition.
- Desktop and mobile previews.

## Project 2 — Margin
Marketplace profit dashboard concept.
- Revenue and profit summaries.
- Charts and analytical cards.
- Table or product-level metrics.
- Consistent dashboard design.

## Project 3 — Growth
Digital marketing landing page concept.
- Campaign-focused headline.
- Clear conversion CTA.
- Modern marketing visuals.
- Strong section hierarchy.

## Project 4 — Forma
Corporate website concept.
- Professional service presentation.
- Corporate visual identity.
- Credible service and contact sections.

## Project 5 — Trackly
Analytics application concept.
- Mobile and desktop interface.
- Charts, activity summaries, and useful data visualization.

## Project 6 — Loom
Digital product landing page concept.
- Product-focused hero.
- Feature presentation.
- Pricing or offer section where appropriate.
- Conversion-focused CTA.

These are concept directions unless actual project data verifies otherwise.

Do not falsely present concept work as completed client engagements.

Each card must include:
- High-quality visual preview.
- Project title.
- Concise explanation of the business problem it addresses.
- Relevant category tags.
- Clear Demo CTA.
- Appropriate hover interaction.

Do not use the same generic dashboard screenshot across all projects.

Make the portfolio feel like a curated premium product collection.

# 10. INTERACTIVE DEMO LAB

The portfolio must go beyond static images.

Create a reusable structure for dedicated demo pages or experiences.

Where appropriate, provide:
- Clickable navigation.
- Functional tabs and filters.
- Interactive charts or controls.
- Working product selection or variant selection.
- Simulated forms and CTA flows.
- Sample analytics interactions.
- Guided explanations of the value being demonstrated.
- Reset or replay options where useful.

Use mock data for demos unless a real backend is intentionally required.

Clearly distinguish simulated actions from real transactions or external integrations.

Do not claim that a simulated purchase, submitted lead, analytics event, or dashboard transaction is real.

Every Demo button must lead to a working demo or clearly communicate that the demo is not yet available.

Do not build a full customer-facing SaaS platform or website builder.

# 11. DIGITAL TEMPLATE MARKETPLACE

Preserve the existing marketplace business model.

Visitors should be able to:
- Browse template categories.
- Inspect template details.
- View previews and available demos.
- Understand format, compatibility, and license terms.
- See accurate pricing where configured.
- Follow the relevant purchase or checkout link.

Keep product data structured and reusable.

Do not fabricate products, prices, payment status, or download access.

External checkout is acceptable for the initial launch if that is what the existing business plan supports.

Do not expose paid source files or permanent private download URLs publicly.

# 12. BILINGUAL INDONESIAN AND ENGLISH

Preserve the existing Indonesian and English routes.

Verify:
- Correct navigation and language switching.
- Consistent layout across languages.
- Translated navigation, CTA, product descriptions, and demo instructions.
- Appropriate language-specific SEO metadata.
- Correct internal links between language variants.

Do not remove bilingual functionality during the redesign.

# 13. RESPONSIVE DESIGN

Desktop:
- Reproduce the wide, immersive composition of the reference.
- Give the hero scene adequate space.
- Keep the headline and visual artwork balanced.

Tablet:
- Rebalance the layout.
- Scale and reposition 3D objects.
- Preserve visual depth and legibility.

Mobile:
- Recompose the hero instead of simply shrinking the desktop design.
- Maintain readable typography.
- Ensure dashboard details remain meaningful.
- Prevent horizontal overflow.
- Reduce expensive 3D effects when necessary.
- Maintain usable navigation and CTAs.

# 14. PERFORMANCE AND PRODUCTION READINESS

Ensure:
- Large images are optimized.
- 3D textures use reasonable dimensions.
- Nonessential assets load lazily.
- Heavy 3D components are loaded appropriately.
- Animations do not block the initial render.
- WebGL failure has a graceful fallback.
- No unnecessary dependency duplication exists.
- No secrets are exposed in client-side code.
- Existing security controls are preserved.
- Production builds are tested.

Do not add a heavy visual system that makes the website unusably slow.

# 15. PRE-LAUNCH CONTENT PREPARATION

Prepare a reusable content brief for each featured demo.

Each brief should include:
- Target audience.
- Business problem.
- Product value proposition.
- Three alternative opening hooks.
- A 10–15 second vertical video storyboard.
- Scene timing.
- On-screen text.
- Motion and transition directions.
- CTA.
- TikTok adaptation.
- Instagram Reels/Stories adaptation.
- Threads discussion angle.
- Meta Ads adaptation.

The platforms must not all receive identical copy.

Prepare editable motion-design specifications and reusable scene assets where practical.

Do not claim to have exported a finished MP4 unless a video file was actually generated and verified.

# 16. PRE-LAUNCH WAITLIST

Preserve or implement a clear early-access CTA if it fits the existing project.

Collect only necessary information.

Explain the intended use of submitted information.

Do not fabricate subscriber counts, waitlist activity, or conversion results.

If the backend is not configured, clearly identify the missing configuration instead of pretending the form is connected.

# 17. SECURITY AND ASSET PROTECTION

Preserve and strengthen existing security controls.

- Never expose private environment variables.
- Protect admin routes with server-side authorization.
- Apply appropriate Supabase RLS policies if Supabase is configured.
- Validate external input.
- Protect private product downloads.
- Do not rely on frontend visibility restrictions for security.
- Do not fabricate security or compliance claims.

Recognize that public frontend assets and designs cannot be made impossible to copy. Focus on protecting private code, credentials, premium downloadable files, and business-sensitive information.

# 18. IMPLEMENTATION WORKFLOW

Follow this order.

PHASE 1 — AUDIT
- Inspect project architecture and current assets.
- Inspect the reference.
- Create a visual discrepancy checklist.
- Identify missing assets and appropriate dependencies.

PHASE 2 — HERO VISUAL
- Install only required dependencies.
- Create or acquire the necessary visual assets.
- Implement the dashboard scene.
- Implement the 3D objects, lighting, and motion.
- Verify the actual hero appearance.

PHASE 3 — PORTFOLIO
- Improve the six visual mockups.
- Build reusable portfolio components.
- Verify Demo links and project descriptions.

PHASE 4 — FULL PAGE
- Refine section composition, typography, spacing, surfaces, and transitions.
- Preserve working navigation and existing features.

PHASE 5 — RESPONSIVENESS AND PERFORMANCE
- Verify desktop, tablet, and mobile.
- Optimize assets and animations.
- Check accessibility and fallbacks.

PHASE 6 — VERIFICATION
- Run the development server.
- Inspect the actual rendered page using available browser or screenshot tools.
- Compare the result against the reference.
- Fix the largest remaining visual discrepancies.
- Run the production build and available checks.

Do not stop after writing code or installing dependencies.

Do not report visual success solely because the project compiles.

# 19. FINAL ACCEPTANCE CRITERIA

The implementation is accepted only when:

- The hero contains a substantial, visually rich dashboard composition.
- The reference's 3D/glass visual language is clearly reflected.
- Required assets have actually been created, acquired, or integrated.
- Motion is implemented and usable.
- Portfolio previews are distinct and visually polished.
- Demo buttons behave honestly and correctly.
- Indonesian and English routes remain functional.
- Desktop and mobile layouts are verified.
- No fabricated business claims are added.
- Existing business logic is preserved.
- Available production checks pass.
- Remaining visual differences are explicitly documented.

# 20. FINAL REPORT

Provide a concise report with:

1. Files and components changed.
2. Dependencies installed and why.
3. Assets created or acquired.
4. Asset sources and license notes where relevant.
5. Actual visual improvements.
6. Tests performed and their results.
7. Remaining gaps compared with the reference.
8. Any manual action still required.

If you cannot acquire an external asset, access the reference, render a screenshot, or verify a feature, state that limitation honestly.

Start by auditing the existing project and reference image. Then implement the highest-impact visual improvements directly in the existing codebase.

The primary objective is visual fidelity and a premium interactive experience, not adding more features or generating more generic CSS.